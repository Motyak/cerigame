#!/bin/bash

echo "Installing node modules on frontend.."
cd frontend; npm install &&\
echo -e "Succeeded!\n"

echo "Compiling Angular app.."
# node_modules/@angular/cli/bin/ng build &&\
ng build &&\
echo -e "Succeeded!\n"

echo "Installing node modules on backend.."
cd ../backend; npm install &&\
echo -e "Succeeded!\n"