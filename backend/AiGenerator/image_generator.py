from APIEval.settings import IMAGE_GENERATION
if IMAGE_GENERATION =="True":
    from diffusers import StableDiffusionPipeline
    import torch, io
    from django.core.files.uploadedfile import InMemoryUploadedFile

    pipe = StableDiffusionPipeline.from_pretrained(
        "SG161222/Realistic_Vision_V5.1_noVAE",
        # safety_checker=None
    ).to("cpu")

    def generate_image(prompt:str, id:str):
        prompt = str(prompt).replace('%20', ' ')
        try:
            print('prompt recieved : ', str(prompt).strip())
            image = pipe(str(prompt).strip(), height=200, width=200).images[0]
            # image.save(id+".png")
            img_io = io.BytesIO()
            image.save(img_io, format="PNG")
            img_io.seek(0)
            image_file = InMemoryUploadedFile(
                file=img_io,
                field_name=None,
                name=f"{id}.png",
                content_type='image/png',
                size=img_io.getbuffer().nbytes,
                charset=None
            )

            return image_file

        except Exception as e:
            print("Error generating image")
