// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-
/* exported init buildPrefsWidget */

const { Gio, GObject, Gtk } = imports.gi;

const GLib = imports.gi.GLib;

const Gettext = imports.gettext.domain('gnome-shell-extensions');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;


function init() {
    //ExtensionUtils.initTranslations();
}

const xbindkeysPrefs = GObject.registerClass(
class xbindkeysPrefs extends Gtk.Grid {
    _init(params) {
        super._init(params);

        this.margin = 30;
        this.row_spacing = 30;
        this.orientation = Gtk.Orientation.VERTICAL;

        try {
            this._settings = ExtensionUtils.getSettings();
        } catch (e) {
            logError(e, 'Failed to load gnome-shell-extension_xbindkeys settings');
        }
        
        var check_debug = new Gtk.CheckButton({
            label: _('Debug'),
            margin_top: 6,
        });
        this._settings.bind('debug', check_debug, 'active', Gio.SettingsBindFlags.DEFAULT);
        this.add(check_debug);

        var check_autocreate = new Gtk.CheckButton({
            label: _('Autocreate'),
            margin_top: 6,
        });
        this._settings.bind('autocreate', check_autocreate, 'active', Gio.SettingsBindFlags.DEFAULT);
        this.add(check_autocreate);

        var button_files = new Gtk.LinkButton({
            label: _('Configuration Files'),
            margin_top: 6,
        });
        button_files.set_uri("file:///" + GLib.get_home_dir() + "/.config/xbindkeys");
        this.add(button_files);

        var button_docs = new Gtk.LinkButton({
            label: _('Documentation'),
            margin_top: 6,
        });
        button_docs.set_uri("https://www.nongnu.org/xbindkeys/xbindkeys.html#configuration");
        this.add(button_docs);
    }
});

function buildPrefsWidget() {
    let xbksPrefs = new xbindkeysPrefs();
    xbksPrefs.show_all();
    return xbksPrefs;
}

