from langchain_ollama import ChatOllama
from pydantic import BaseModel
from langchain_core.prompts import PromptTemplate
from django.contrib.auth.models import User
from cocktail.models import Cocktail, Ingredient
from typing import Optional
from langgraph.graph import StateGraph, END
from APIEval.settings import IMAGE_GENERATION
from django.core.files.uploadedfile import InMemoryUploadedFile
from uuid import uuid4
import io


llm = ChatOllama(model="llama3")

class ReplyContent(BaseModel):
    reply: str

class GeneratorState(BaseModel):
    class Config:
        arbitrary_types_allowed = True
        
    user_id: Optional[int] = None
    message: Optional[str] = None
    is_cocktail: bool = False
    reply: Optional[str] = None
    cocktail_name: str = None
    cocktail_description: str = None
    cocktail_music_type: str = None
    cocktail_ingredients: list[str] = None
    cocktail_image_prompt: str = None
    cocktail_image: Optional[InMemoryUploadedFile] = None


class IsRequestCocktail(BaseModel):
    is_cocktail: bool

ai_prompt_detection= PromptTemplate.from_template(
    """
You are an assistant that suggests cocktails with name, description, ingredients and a music type that fits

You have to answer with a boolean `is_cocktail`:

- `true` if the input is a request to create a cocktail
- `false` if it is not

AND you have to answer with a boolean `with_image` and a string `image_prompt`:

- `true` if the user wants an image with the cocktail
- `false` if the user does not want an image with the cocktail

AND if `with_image` is true, you have to answer with a string `image_prompt` that describes the image to generate.
If `with_image` is false, `image_prompt` must be an empty string.

User input : 
{message}

"""
)

def detect_cocktail_intent(state: GeneratorState) -> GeneratorState:
    message = state.message
    structured_llm = llm.with_structured_output(IsRequestCocktail)
    chain = ai_prompt_detection | structured_llm
    result = chain.invoke({"message": message})
    
    return GeneratorState(
        user_id=state.user_id,
        message=state.message,
        is_cocktail=result.is_cocktail,
        reply=state.reply,
    )

class ExtractedInfo(BaseModel):
    cocktail_name: str
    cocktail_description: str
    cocktail_music_type: str
    cocktail_ingredients: list[str]
    cocktail_image_prompt: Optional[str]

extraction_prompt = PromptTemplate.from_template(
    """
    You have to extract the name of the cocktail, a description of the cocktail, the music type and the ingredients created with the input of the user.
    You have to respond with the following fields:
    `cocktail_name`
    `cocktail_description`
    `cocktail_music_type`
    `cocktail_ingredients`
    `cocktail_image_prompt`

    Examples : 
    - I feel like something fruity but with gin, and not too sweet
    - A non-alcoholic cocktail for an afternoon on the terrace
    - An original creation with whisky and lime
    - I'm in a good mood and the weather is nice today, what would you recommend I drink?

    User input : 
    {message}
"""
)


def extract_info(state: GeneratorState) -> GeneratorState:
    message = state.message
    structured_llm = llm.with_structured_output(ExtractedInfo)
    chain = extraction_prompt | structured_llm
    result = chain.invoke({"message": message})
    print(result.cocktail_ingredients)
    return GeneratorState(
        user_id=state.user_id,
        message=state.message,
        is_cocktail=state.is_cocktail,
        reply=state.reply,

        cocktail_name= result.cocktail_name,
        cocktail_description = result.cocktail_description,
        cocktail_music_type = result.cocktail_music_type,
        cocktail_ingredients = result.cocktail_ingredients,
        cocktail_image_prompt = result.cocktail_image_prompt
    )

def generate_request_image(state: GeneratorState) -> GeneratorState:
    if IMAGE_GENERATION == "True":
        from .image_generator import generate_image

        image_id = uuid4()
        state.cocktail_image = generate_image(state.cocktail_image_prompt, image_id)
    
    return state

def create_cocktail_ingredients(state: GeneratorState) -> GeneratorState: 
    name = state.cocktail_name
    description = state.cocktail_description
    user = User.objects.get(id=state.user_id)

    cocktail = Cocktail(
        name=name,
        description=description,
        music_type=state.cocktail_music_type,
        user = user,
        generated_image = state.cocktail_image
    )

    try:
        cocktail.save()
        for ingredient_name in state.cocktail_ingredients:
            ingredient, created = Ingredient.objects.get_or_create(name=ingredient_name)
            cocktail.ingredients.add(ingredient)
            
    except Exception as e:
        print(f"Error saving cocktail: {e}")

    return state

    

acknowledge_prompt = PromptTemplate.from_template("""
    Inform the user that the cocktail {cocktailname} has been successfully added.
    Respond nicely.
    
    User input : 
    {message}
    
""")

def inform_user_cocktail_created(state: GeneratorState) -> GeneratorState:
    message = state.message
    structured_llm = llm.with_structured_output(ReplyContent)
    chain = acknowledge_prompt | structured_llm
    result = chain.invoke({"message": message, "cocktailname": state.cocktail_name})

    state.reply = result.reply

    return state


response = PromptTemplate.from_template("""
    Answer the user based on your general knowledge
    
    User input:
    {message}
""")

def respond_to_user(state: GeneratorState):
    message = state.message
    structured_llm = llm.with_structured_output(ReplyContent)
    chain = response | structured_llm
    result = chain.invoke({"message": message})
    print(result)

    return GeneratorState(
        reply=result.reply,

        is_cocktail= state.is_cocktail,
        message=state.message,
        user_id= state.user_id
    )

graph = StateGraph(GeneratorState)

# Creating nodes
graph.add_node("detect_cocktail_intent", detect_cocktail_intent)
graph.add_node("extract_info", extract_info)
graph.add_node("respond_to_user", respond_to_user)
graph.add_node("create_cocktail_ingredients", create_cocktail_ingredients)
graph.add_node("generate_request_image", generate_request_image)
graph.add_node("inform_user_cocktail_created", inform_user_cocktail_created)

# Graph execution order
graph.set_entry_point("detect_cocktail_intent")
graph.add_conditional_edges("detect_cocktail_intent", lambda state: "extract_info" if state.is_cocktail else "respond_to_user")
graph.add_conditional_edges("extract_info", lambda state: "generate_request_image" if state.cocktail_image_prompt else "create_cocktail_ingredients")
graph.add_edge("generate_request_image", "create_cocktail_ingredients")
graph.add_edge("create_cocktail_ingredients", "inform_user_cocktail_created")
graph.add_edge("inform_user_cocktail_created", END)
graph.add_edge("respond_to_user", END)



generator_graph = graph.compile()