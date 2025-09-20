import re
import pytesseract
from PIL import Image
import pandas as pd

df = pd.read_csv("/sih_dataset.csv")

def normalize_cert_id(cert_id):
    if cert_id:
        cert_id = re.sub(r'\s*-\s*', '-', cert_id)
        cert_id = cert_id.replace(" ", "")
    return cert_id


def extract_fields(text):
    cert_id = re.search(r'(JH[\s\-_]*UNI[\s\-_]*\d{4}[\s\-_]*\d+)', text, re.IGNORECASE)
    if not cert_id:
        cert_id = re.search(r'(\b\d{4}[\s\-_]*\d+\b)', text)
    dob = re.search(r'Date of Birth[:\s]*([\d°]{1,2}\s*\w+\s*\d{4})', text, re.IGNORECASE)
    name = re.search(r'This certifies that\s*([A-Za-z ]+)', text, re.IGNORECASE)
    if not name:
        name = re.search(r'\n([A-Z][A-Z ]{2,})\n', text)
    course = re.search(r'(?:study|program) in\s*([A-Za-z0-9 .&]+)', text, re.IGNORECASE)

    cert_id_value = None
    if cert_id:
        cert_id_value = cert_id.group(1)
        cert_id_value = re.sub(r'[\s\-_]*', '-', cert_id_value)
        cert_id_value = re.sub(r'-+', '-', cert_id_value)
        cert_id_value = cert_id_value.strip("-")

    return {
        "cert_id": cert_id_value,
        "dob": dob.group(1).replace("°", "").strip() if dob else None,
        "name": name.group(1).strip().title() if name else None,
        "course": course.group(1).strip() if course else None
    }

def verify_certificate(image_path, df):
    img = Image.open(image_path)
    text = pytesseract.image_to_string(img)

    print("\nExtracted OCR text:\n", text)

    fields = extract_fields(text)
    print("\nExtracted fields:", fields)

    if not fields["cert_id"]:
        print("\n Could not extract Certificate ID from OCR text.")
        return

    record = df[df["cert_id"] == fields["cert_id"]]

    if not record.empty:
        print("\n Certificate FOUND in database:", record.to_dict(orient="records")[0])
    else:
        print("\n Certificate NOT found in database.")

certificates = [
    "/Users/jigyasaverma/Desktop/backend/Edu_cred_verify/EduCred-Verify/backend/certificates/JBS Certificate.png",
    "/Users/jigyasaverma/Desktop/backend/Edu_cred_verify/EduCred-Verify/backend/certificates/JSU Certificate (2).png",
    "/Users/jigyasaverma/Desktop/backend/Edu_cred_verify/EduCred-Verify/backend/certificates/RTI Certificate (1).png"
]

for cert in certificates:
    print("\n==============================")
    print("Checking:", cert)
    print("==============================")
    verify_certificate(cert, df)
