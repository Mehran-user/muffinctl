const Gio = imports.gi.Gio;
const Meta = imports.gi.Meta;
const GLib = imports.gi.GLib;
const Main = imports.ui.main;

const DBUS_PATH = "/org/muffin/WindowControl";
const DBUS_NAME = "org.muffin.WindowControl";

const DBUS_XML =
'<node>' +
'  <interface name="' + DBUS_NAME + '">' +
'    <method name="ListWindows">' +
'      <arg direction="in" name="includeAll" type="b"/>' +
'      <arg direction="out" name="result" type="s"/>' +
'    </method>' +
'    <method name="ActivateWindow">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="CloseWindow">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="MinimizeWindow">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="MaximizeWindow">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="UnmaximizeWindow">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="FullscreenWindow">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="UnfullscreenWindow">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="ResizeWindow">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="in" name="width" type="i"/>' +
'      <arg direction="in" name="height" type="i"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="MoveWindow">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="in" name="x" type="i"/>' +
'      <arg direction="in" name="y" type="i"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="MoveResizeWindow">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="in" name="x" type="i"/>' +
'      <arg direction="in" name="y" type="i"/>' +
'      <arg direction="in" name="width" type="i"/>' +
'      <arg direction="in" name="height" type="i"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="SetWindowWorkspace">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="in" name="wsIndex" type="i"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="ChangeWorkspace">' +
'      <arg direction="in" name="wsIndex" type="i"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="ListWorkspaces">' +
'      <arg direction="out" name="result" type="s"/>' +
'    </method>' +
'    <method name="AddWorkspace">' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="RemoveWorkspace">' +
'      <arg direction="in" name="wsIndex" type="i"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="SetWorkspaceName">' +
'      <arg direction="in" name="wsIndex" type="i"/>' +
'      <arg direction="in" name="name" type="s"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="ToggleShadeWindow">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="ShadeWindow">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="UnshadeWindow">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="RaiseWindow">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="LowerWindow">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="SetWindowAlwaysOnTop">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="in" name="enabled" type="b"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="SetWindowSkipPager">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="in" name="enabled" type="b"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="SetWindowSkipTasklist">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="in" name="enabled" type="b"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="SetWindowSticky">' +
'      <arg direction="in" name="winId" type="s"/>' +
'      <arg direction="in" name="enabled" type="b"/>' +
'      <arg direction="out" name="result" type="b"/>' +
'    </method>' +
'    <method name="SearchWindows">' +
'      <arg direction="in" name="pattern" type="s"/>' +
'      <arg direction="out" name="result" type="s"/>' +
'    </method>' +
'    <method name="GetActiveWindow">' +
'      <arg direction="out" name="result" type="s"/>' +
'    </method>' +
'  </interface>' +
'</node>';

function _getWindows(includeAll) {
    var windows = [];
    var n = global.workspace_manager.get_n_workspaces();
    var activeIdx = global.workspace_manager.get_active_workspace_index();
    var i, j, ws, wsWindows, win, rect, wsObj, wsIdx, pid;

    if (includeAll) {
        for (i = 0; i < n; i++) {
            ws = global.workspace_manager.get_workspace_by_index(i);
            if (!ws) continue;
            wsWindows = ws.list_windows();
            for (j = 0; j < wsWindows.length; j++) {
                win = wsWindows[j];
                rect = win.get_frame_rect();
                wsObj = win.get_workspace();
                wsIdx = wsObj ? wsObj.index() : i;
                pid = 0;
                try { pid = win.get_pid(); } catch(e) {}
                windows.push({
                    id: String(win.get_stable_sequence()),
                    title: win.get_title() || "",
                    wmClass: win.get_wm_class() || "",
                    wmInstance: win.get_wm_class_instance() || "",
                    pid: pid,
                    x: rect.x, y: rect.y,
                    width: rect.width, height: rect.height,
                    workspace: wsIdx,
                    minimized: win.minimized || false,
                    maximized: win.get_maximized() !== Meta.MaximizeFlags.NONE,
                    fullscreen: win.is_fullscreen() || false,
                    shaded: win.shaded || false,
                    alwaysOnTop: win.is_above() || false,
                    sticky: win.is_on_all_workspaces() || false,
                    skipPager: win.skipPager || false,
                    skipTaskbar: win.skipTaskbar || false
                });
            }
        }
    } else {
        ws = global.workspace_manager.get_active_workspace();
        if (ws) {
            wsWindows = ws.list_windows();
            for (j = 0; j < wsWindows.length; j++) {
                win = wsWindows[j];
                rect = win.get_frame_rect();
                pid = 0;
                try { pid = win.get_pid(); } catch(e) {}
                windows.push({
                    id: String(win.get_stable_sequence()),
                    title: win.get_title() || "",
                    wmClass: win.get_wm_class() || "",
                    wmInstance: win.get_wm_class_instance() || "",
                    pid: pid,
                    x: rect.x, y: rect.y,
                    width: rect.width, height: rect.height,
                    workspace: activeIdx,
                    minimized: win.minimized || false,
                    maximized: win.get_maximized() !== Meta.MaximizeFlags.NONE,
                    fullscreen: win.is_fullscreen() || false,
                    shaded: win.shaded || false,
                    alwaysOnTop: win.is_above() || false,
                    sticky: win.is_on_all_workspaces() || false,
                    skipPager: win.skipPager || false,
                    skipTaskbar: win.skipTaskbar || false
                });
            }
        }
    }
    return windows;
}

function _findWindow(winId) {
    var n = global.workspace_manager.get_n_workspaces();
    var i, j, ws, wins;
    for (i = 0; i < n; i++) {
        ws = global.workspace_manager.get_workspace_by_index(i);
        if (!ws) continue;
        wins = ws.list_windows();
        for (j = 0; j < wins.length; j++) {
            if (String(wins[j].get_stable_sequence()) === String(winId))
                return wins[j];
        }
    }
    return null;
}

var busOwnerID = 0;
var exported = null;

var iface = {};

iface.ListWindows = function(includeAll) {
    global.log("muffin-window-control: ListWindows includeAll=" + includeAll + " type=" + typeof includeAll);
    return JSON.stringify(_getWindows(includeAll));
};

iface.ActivateWindow = function(winId) {
    global.log("muffin-window-control: ActivateWindow winId=" + winId + " type=" + typeof winId + " args=" + arguments.length);
    var win = _findWindow(winId);
    if (win) win.activate(global.get_current_time());
    return win !== null;
};

iface.CloseWindow = function(winId) {
    var win = _findWindow(winId);
    if (win) win.delete(global.get_current_time());
    return win !== null;
};

iface.MinimizeWindow = function(winId) {
    var win = _findWindow(winId);
    if (win) win.minimize();
    return win !== null;
};

iface.MaximizeWindow = function(winId) {
    var win = _findWindow(winId);
    if (win) win.maximize(Meta.MaximizeFlags.BOTH);
    return win !== null;
};

iface.UnmaximizeWindow = function(winId) {
    var win = _findWindow(winId);
    if (win) win.unmaximize(Meta.MaximizeFlags.BOTH);
    return win !== null;
};

iface.FullscreenWindow = function(winId) {
    var win = _findWindow(winId);
    if (win) win.make_fullscreen();
    return win !== null;
};

iface.UnfullscreenWindow = function(winId) {
    var win = _findWindow(winId);
    if (win) win.unmake_fullscreen();
    return win !== null;
};

iface.ResizeWindow = function(winId, width, height) {
    var win = _findWindow(winId);
    if (win) {
        var r = win.get_frame_rect();
        win.move_resize_frame(true, r.x, r.y, width, height);
    }
    return win !== null;
};

iface.MoveWindow = function(winId, x, y) {
    var win = _findWindow(winId);
    if (win) {
        var r = win.get_frame_rect();
        win.move_resize_frame(true, x, y, r.width, r.height);
    }
    return win !== null;
};

iface.MoveResizeWindow = function(winId, x, y, width, height) {
    var win = _findWindow(winId);
    if (win) win.move_resize_frame(true, x, y, width, height);
    return win !== null;
};

iface.SetWindowWorkspace = function(winId, wsIndex) {
    var win = _findWindow(winId);
    if (win) {
        var ws = global.workspace_manager.get_workspace_by_index(wsIndex);
        if (ws) win.change_workspace(ws);
    }
    return win !== null;
};

iface.ChangeWorkspace = function(wsIndex) {
    var ws = global.workspace_manager.get_workspace_by_index(wsIndex);
    if (ws) ws.activate(global.get_current_time());
    return ws !== null;
};

iface.ListWorkspaces = function() {
    var n = global.workspace_manager.get_n_workspaces();
    var activeIdx = global.workspace_manager.get_active_workspace_index();
    var list = [];
    for (var i = 0; i < n; i++) {
        var ws = global.workspace_manager.get_workspace_by_index(i);
        var name = "";
        try { name = ws.get_name(); } catch(e) {
            try { name = ws.name; } catch(e2) {
                name = "Workspace " + (i + 1);
            }
        }
        list.push({
            index: i,
            name: name,
            active: i === activeIdx
        });
    }
    return JSON.stringify(list);
};

iface.AddWorkspace = function() {
    Main._addWorkspace();
    return true;
};

iface.RemoveWorkspace = function(wsIndex) {
    var ws = global.workspace_manager.get_workspace_by_index(wsIndex);
    if (ws) Main._removeWorkspace(ws);
    return ws !== null;
};

iface.SetWorkspaceName = function(wsIndex, name) {
    var ws = global.workspace_manager.get_workspace_by_index(wsIndex);
    if (ws) {
        try { ws.set_name(name); } catch(e) {
            try { ws.name = name; } catch(e2) {}
        }
    }
    return ws !== null;
};

iface.ToggleShadeWindow = function(winId) {
    var win = _findWindow(winId);
    if (win) { if (win.shaded) win.unmake_shaded(); else win.make_shaded(); }
    return win !== null;
};

iface.ShadeWindow = function(winId) {
    var win = _findWindow(winId);
    if (win) win.make_shaded();
    return win !== null;
};

iface.UnshadeWindow = function(winId) {
    var win = _findWindow(winId);
    if (win) win.unmake_shaded();
    return win !== null;
};

iface.RaiseWindow = function(winId) {
    var win = _findWindow(winId);
    if (win) win.raise();
    return win !== null;
};

iface.LowerWindow = function(winId) {
    var win = _findWindow(winId);
    if (win) win.lower();
    return win !== null;
};

iface.SetWindowAlwaysOnTop = function(winId, enabled) {
    var win = _findWindow(winId);
    if (win) { if (enabled) win.make_above(); else win.unmake_above(); }
    return win !== null;
};

iface.SetWindowSkipPager = function(winId, enabled) {
    var win = _findWindow(winId);
    if (win) {
        try { win.set_skip_pager(enabled); } catch(e) {
            try { win.skip_pager = enabled; } catch(e2) {}
        }
    }
    return win !== null;
};

iface.SetWindowSkipTasklist = function(winId, enabled) {
    var win = _findWindow(winId);
    if (win) {
        try { win.set_skip_taskbar(enabled); } catch(e) {
            try { win.skip_taskbar = enabled; } catch(e2) {}
        }
    }
    return win !== null;
};

iface.SetWindowSticky = function(winId, enabled) {
    var win = _findWindow(winId);
    if (win) { if (enabled) win.stick(); else win.unstick(); }
    return win !== null;
};

iface.SearchWindows = function(pattern) {
    var wins = _getWindows(true);
    var lower = pattern.toLowerCase();
    var results = wins.filter(function(w) {
        return w.title.toLowerCase().indexOf(lower) !== -1 ||
               w.wmClass.toLowerCase().indexOf(lower) !== -1 ||
               w.wmInstance.toLowerCase().indexOf(lower) !== -1;
    });
    return JSON.stringify(results);
};

iface.GetActiveWindow = function() {
    var win = global.display.get_focus_window();
    if (win) return JSON.stringify({
        id: String(win.get_stable_sequence()),
        title: win.get_title() || "",
        wmClass: win.get_wm_class() || "",
        wmInstance: win.get_wm_class_instance() || ""
    });
    return "";
};

function init() {
}

function enable() {
    busOwnerID = Gio.bus_own_name(
        Gio.BusType.SESSION,
        DBUS_NAME,
        Gio.BusNameOwnerFlags.NONE,
        function(connection, name) {
            global.log("muffin-window-control: bus acquired: " + name);
            exported = Gio.DBusExportedObject.wrapJSObject(DBUS_XML, iface);
            exported.export(connection, DBUS_PATH);
            global.log("muffin-window-control: exported at " + DBUS_PATH);
        },
        function(connection, name) {
            global.log("muffin-window-control: name acquired: " + name);
        },
        function(connection, name) {
            global.log("muffin-window-control: name lost: " + name);
        }
    );
}

function disable() {
    if (exported) {
        exported.unexport();
        exported = null;
    }
    if (busOwnerID) {
        Gio.bus_unown_name(busOwnerID);
        busOwnerID = 0;
    }
}
