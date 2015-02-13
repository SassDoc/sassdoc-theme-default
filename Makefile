PATH := $(PWD)/node_modules/.bin:$(PATH)

SOURCES := $(wildcard src/*.js)
DIST := $(SOURCES:src/%=dist/%)

all: lint dist min sass

publish: lint dist
	npm publish

lint:
	jshint $(SOURCES)

dist: $(DIST)

dist/%.js: src/%.js
	mkdir -p $(@D)
	6to5 --optional selfContained $< -o $@

min: assets/js/main.min.js

assets/js/main.min.js: \
	assets/js/vendor/fuse.min.js \
	assets/js/sidebar.js \
	assets/js/search.js \
	assets/js/main.js \
	assets/js/vendor/prism.min.js
	cat $^ | uglifyjs > $@

sass:
	sass --update scss:assets/css --style compressed

clean:
	rm -rf $(DIST) assets/js/main.min.js assets/css

rebuild:
	rm -rf node_modules && npm install

.PHONY: all dist min sass clean
