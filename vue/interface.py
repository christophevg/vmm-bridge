import os
from os import listdir
from os.path import isfile, join

from flask  import render_template, send_from_directory
from flask  import request
from jinja2 import TemplateNotFound

from vue.web  import server

def render(template, **kwargs):
  try:
    return render_template(
      os.path.join(template + ".html"),
      **kwargs
    )
  except TemplateNotFound:
    return render_template(
      "404.html",
      app=app,
      user=user,
      without_sections=True
    )

@server.route("/app/<path:filename>")
def send_app_static(filename):
  return send_from_directory(os.path.join("app"), filename)

def list_services():
  path = os.path.join(os.path.dirname(__file__), "app")
  services = [os.path.splitext(f)[0] for f in listdir(path) if isfile(join(path, f))]
  return sorted(services)

@server.route("/")
def render_home():
  return render("main", services=list_services())

@server.route("/<path:section>")
def render_section(section):
  return render("main", services=list_services())
