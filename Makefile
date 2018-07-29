vue:
	@. venv/bin/activate; pip install -r requirements.vue.txt > /dev/null; PYTHONPATH=. python -m vue


.PHONY: vue
