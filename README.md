# NearBuy 

__Screenshots of the app__

https://github.com/mojotti/near_buy/wiki/Screenshots-of-the-React-Native-app

__Running instuctions - back-end:__ 

	Install Python3.4:
		https://www.python.org/downloads/
		
	Install MongoDB:
		https://docs.mongodb.com/manual/installation/
    
	Check you have correct python version:
		python3 --version (should be 3.4.X)

	Install pipenv:
		export LC_ALL=en_US.UTF-8 && pip install pipenv

	Install packages to work area:
		cd back-end && pipenv install
 
	Launch pipenv:
		pipenv shell

	Run app.py:
		python app.py

	Run unit tests:
		nosetests tests/

	To deactivate pipenv (closes current terminal tab/window):
		exit

__Running instructions - React Native:__ 

	install npm packages:
		cd react-native && npm install

	run:
		npm start

	run tests: 
		npm test
