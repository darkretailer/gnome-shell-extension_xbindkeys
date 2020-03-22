var Meta = imports.gi.Meta;
var ExtensionUtils = imports.misc.extensionUtils;

var _windowFocusId;
var _settings;

const Util = imports.misc.util;
const Shell = imports.gi.Shell;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

function init() {
    _settings = ExtensionUtils.getSettings();
}

function enable() {
    _windowFocusId = global.display.connect('notify::focus-window', (d, win) => {
        const DEBUG = _settings.get_boolean('debug');
        const autocreate = _settings.get_boolean('autocreate');

        var app_id = Shell.WindowTracker.get_default().focus_app.get_id().replace(/.desktop/gi, '');
        var app_name = Shell.WindowTracker.get_default().focus_app.get_name();
        var app_name_f = app_name.replace(/[^a-z0-9]/gi, '_');
        var app_title = Shell.WindowTracker.get_default().focus_app.get_windows()[0].get_title();
        var app_title_f = app_title.replace(/[^a-z0-9]/gi, '_');

        var xbindkeys_bin = "/usr/bin/xbindkeys";
        var xbindkeys_dir = GLib.get_home_dir() + "/.config/xbindkeys";
        var config_suffix = ".xkbnd"
        

        // kill old xbindkeys-instances
        Util.spawn(["/bin/bash", "-c", "pkill -f 'xbindkeys -f' > /dev/null 2>&1 || true"]);
        Util.spawn(["/bin/bash", "-c", "pkill 'xbindkeys' > /dev/null 2>&1 || true"]);

        var app_config_dir = xbindkeys_dir + "/" + app_name_f;

        // Create directory
        // if (! GLib.file_test(app_config_dir, GLib.FileTest.IS_DIR) ) {
        //     if (DEBUG) { global.log("xbindkeys: no config set: app_id: '" + app_id + "' app_title: '" + app_title + "' app_name: '" + app_name + "'"); }
        //     if (autocreate) {
        //         GLib.mkdir_with_parents(app_config_dir, 0750);
        //     }
        // }

        // run xbindkeys
        if ( GLib.file_test(app_config_dir + "/" + app_title_f + config_suffix, GLib.FileTest.IS_REGULAR) ) {
            if (DEBUG) { global.log("xbindkeys: activate via title: " + app_config_dir + "/" + app_title_f + config_suffix); }
            Util.spawn([xbindkeys_bin, '-f', app_config_dir + "/" + app_title_f + config_suffix]);
            Util.spawn([xbindkeys_bin, '-f', app_config_dir + "/" + app_title_f + config_suffix]);

        } else if ( GLib.file_test(app_config_dir + "/" + app_name_f + config_suffix, GLib.FileTest.IS_REGULAR) ) {
            if (DEBUG) { global.log("xbindkeys: activate via name: " + app_config_dir + "/" + app_name_f + config_suffix); }
            Util.spawn([xbindkeys_bin, '-f', app_config_dir + "/" + app_name_f + config_suffix]);
            Util.spawn([xbindkeys_bin, '-f', app_config_dir + "/" + app_name_f + config_suffix]);

        } else {
            if (DEBUG) { global.log("xbindkeys: not found: " + app_name_f + " | " + app_title_f); }
            
            // xbindkey default
            Util.spawn([xbindkeys_bin]);

            if (autocreate) {
                if (! GLib.file_test(app_config_dir, GLib.FileTest.IS_DIR) ) {
                    if (DEBUG) { global.log("xbindkeys: create directory: " + app_config_dir); }
                    GLib.mkdir_with_parents(app_config_dir, 0750);
                }

                var new_file = app_config_dir + "/" + app_title_f + config_suffix + ".DISABLED";
                if (! GLib.file_test(new_file, GLib.FileTest.IS_REGULAR) ) {
                    if (DEBUG) { global.log("xbindkeys: create file: " + new_file); }
                    GLib.file_set_contents(new_file, "# AppTitle: " + app_title);
                }

                new_file = app_config_dir + "/" + app_name_f + config_suffix + ".DISABLED";
                if (! GLib.file_test(new_file, GLib.FileTest.IS_REGULAR) ) {
                    if (DEBUG) { global.log("xbindkeys: create file: " + new_file); }
                    GLib.file_set_contents(new_file, "# AppName: " + app_name);
                }
            }
        }
    });
}

function disable() {
    global.display.disconnect(_windowFocusId);
    _windowFocusId = null;
} 
