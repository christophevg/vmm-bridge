import logging

formatter = logging.Formatter(
  '%(asctime)s - %(name)-10.10s - [%(levelname)-5.5s] - %(message)s'
)
logger = logging.getLogger()

consoleHandler = logging.StreamHandler()
consoleHandler.setFormatter(formatter)
logger.addHandler(consoleHandler)

def disable_console_logging():
  logger.removeHandler(consoleHandler)
