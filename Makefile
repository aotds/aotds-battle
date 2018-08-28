test:
	jest src/

doc:
	babel-node tools/generate_schemas.js
