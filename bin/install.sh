#!/bin/bash

python3.11 -m venv env
. ./env/bin/activate
pip install -r requirements.txt
npm install google-closure-compiler

    # "google-closure-compiler": "^20230411.0.0",
    # "google-closure-deps": "^20230411.0.0",
    # "google-closure-library": "^20230411


python main.py
