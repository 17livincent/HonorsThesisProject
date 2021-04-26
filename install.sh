#!/bin/bash
# Run by: sudo install.sh
apt update
apt upgrade

# Install Python and packages for preprocess.py
apt install -y software-properties-common
add-apt-repository -y ppa:deadsnakes/ppa
apt install python3
apt install python3-pip
pip3 install numpy
pip3 install pandas
pip3 install scikit-learn
pip3 install matplotlib

# Install Node packages for server
npm install

# Install and build Node packages for React client
cd client
npm install
npm run build
cd ..