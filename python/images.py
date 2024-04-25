import requests
from flask import Flask, request, jsonify
import base64
import numpy as np
import cv2
import face_recognition

def process_base64_image(base64_data):
    binary_data = base64.b64decode(base64_data)
    image_array = np.frombuffer(binary_data, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    return image

def are_lists_equal(list1, list2):
    sorted_list1 = sorted(list1)
    sorted_list2 = sorted(list2)
    
    return sorted_list1 == sorted_list2

app = Flask(__name__)

@app.route('/upload_photos', methods=['POST'])

def upload_photos():
    data = request.json
    name_list = data["name_list"]

    known_face_names = []
    known_face_encodings = []

    for photo in data["photos"]:
        name = photo["name"]
        if name in name_list:
            known_face_names.append(photo["name"])
            encoding = face_recognition.face_encodings(process_base64_image(photo["photoData"].split(",")[1]))[0]
            known_face_encodings.append(encoding)
    
    face_locations = []
    face_encodings = []
    result_name_list =[]

    img = process_base64_image(data['files'][0]['data'].split(",")[1])
    face_locations = face_recognition.face_locations(process_base64_image(data['files'][0]['data'].split(",")[1]))
    face_encodings = face_recognition.face_encodings(img, face_locations)

    for _, face_encoding in zip(face_locations, face_encodings):
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        if (np.min(face_distances) < 0.5):
            best_match_index = np.argmin(face_distances)
            name = known_face_names[best_match_index]
            result_name_list.append(name)
    
    return jsonify({'message': 'Data received successfully'},are_lists_equal(result_name_list, name_list))

if __name__ == '__main__':
    app.run(debug=True)
