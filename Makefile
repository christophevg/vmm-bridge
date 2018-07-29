vue: venv
	@echo "*** running webserver for Vue demo..."
	@echo "    use ctrl+c to terminate"
	@. venv/bin/activate; pip install -r requirements.vue.txt > /dev/null; PYTHONPATH=. python -m vue


venv:
	@echo "*** creating virtual Python environment..."
	@virtualenv $@ > /dev/null

mrproper:
	@rm -rf venv

.PHONY: vue
