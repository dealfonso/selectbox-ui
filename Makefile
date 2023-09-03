current_dir = $(notdir $(shell pwd))
UGLIFY_FLAGS_MIN := $(if $(UGLIFY_FLAGS_MIN),$(UGLIFY_FLAGS_MIN),-m)
DIST_FOLDER := $(if $(DIST_FOLDER),$(DIST_FOLDER),dist)
build:
	mkdir -p $(DIST_FOLDER)
ifneq ("","$(wildcard js/*.js)")
	uglifyjs -e window,document,$$:window,document,window.$$ js/*.js $(UGLIFY_FLAGS) -b | cat notice - > $(DIST_FOLDER)/$(current_dir).js
	uglifyjs -e window,document,$$:window,document,window.$$ js/*.js $(UGLIFY_FLAGS_MIN) | cat notice.min - > $(DIST_FOLDER)/$(current_dir).min.js
endif
ifneq ("","$(wildcard css/*.css)")
	cleancss css/*.css --format beautify | cat notice - > $(DIST_FOLDER)/$(current_dir).css
	cleancss css/*.css | cat notice.min - > $(DIST_FOLDER)/$(current_dir).min.css
endif

clean:
	rm -f $(DIST_FOLDER)/$(current_dir).min.js $(DIST_FOLDER)/$(current_dir).min.css $(DIST_FOLDER)/$(current_dir).js $(DIST_FOLDER)/$(current_dir).css
	if [ -d $(DIST_FOLDER) ] && [ -z "$(ls -A $(DIST_FOLDER))" ]; then rm -r $(DIST_FOLDER); fi