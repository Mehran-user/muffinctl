muffinctl

"muffinctl" is a "wmctrl"-like command-line utility for controlling windows and workspaces in the Cinnamon desktop environment.

It works on both X11 and Wayland sessions by communicating with the Muffin Window Control Cinnamon extension over D-Bus.

---

Features

- Window management
- Workspace management
- Works on X11 and Wayland
- Script-friendly CLI
- Cinnamon-native integration
- "wmctrl"-inspired workflow

---

Installation

This repository is intended to be extracted directly into your home folder ("~").

Example:

cd ~
git clone https://github.com/Mehran-user/muffinctl.git .

Or extract the archive contents directly into:

~

The Cinnamon extension is automatically installed when extracted into the home directory.

Enable the extension with:

cinnamon-extensions -e muffin-window-control@mehran

Or enable it from:

Cinnamon Settings → Extensions

---

Usage

muffinctl <command> [options]

---

Commands

Window Control

List windows

muffinctl list
muffinctl list -a

List windows on the current workspace.

Use "-a" or "--all" to list windows across all workspaces.

---

Activate a window

muffinctl activate <winId>

Focus and activate a window.

---

Close a window

muffinctl close <winId>

---

Minimize / maximize

muffinctl minimize <winId>
muffinctl maximize <winId>
muffinctl unmaximize <winId>

---

Fullscreen control

muffinctl fullscreen <winId>
muffinctl unfullscreen <winId>

---

Shade control

muffinctl shade <winId>
muffinctl unshade <winId>
muffinctl toggleshade <winId>

---

Raise / lower

muffinctl raise <winId>
muffinctl lower <winId>

---

Move and resize windows

muffinctl move <winId> <x> <y>

muffinctl resize <winId> <width> <height>

muffinctl moveresize <winId> <x> <y> <width> <height>

---

Sticky windows

muffinctl sticky <winId> [on|off]

Make a window appear on all workspaces.

Defaults to "on".

---

Always on top

muffinctl alwaysontop <winId> [on|off]

Defaults to "on".

---

Skip pager

muffinctl skippager <winId> [on|off]

Hide a window from the workspace pager.

Defaults to "on".

---

Skip taskbar

muffinctl skiptaskbar <winId> [on|off]

Hide a window from the taskbar.

Defaults to "on".

---

Window Search

Search windows

muffinctl search <pattern>

Search windows by:

- title
- WM_CLASS
- WM_CLASS instance

Search is case-insensitive.

---

Active window

muffinctl active

Display the currently focused window.

---

Workspace Control

List workspaces

muffinctl ws-list

---

Switch workspace

muffinctl ws-switch <index>

Workspace indices are 0-based.

---

Add workspace

muffinctl ws-add

---

Remove workspace

muffinctl ws-remove <index>

---

Rename workspace

muffinctl ws-rename <index> <name>

---

Workspace Assignment

Move a window to another workspace

muffinctl ws-move <winId> <wsIndex>

---

Output Format

Window and workspace lists use tab-separated columns.

Formatting adapts automatically depending on available tools:

- "jq"
- "python3"
- plain text fallback

Window list columns

winId    workspace    title

Workspace list columns

workspace index    name    active status

---

Examples

List all windows

muffinctl list -a

Find Firefox windows

muffinctl search firefox

Activate a window

muffinctl activate 123

Move and resize a window

muffinctl moveresize 123 100 100 800 600

List workspaces

muffinctl ws-list

Switch workspace

muffinctl ws-switch 1

Move a window to another workspace

muffinctl ws-move 123 2

---

Environment

DBUS_SESSION_BUS_ADDRESS

Used to communicate with the Cinnamon extension.

---

Notes

Window IDs are stable sequence numbers assigned by Muffin/Cinnamon.

They may change across sessions.

---

Bugs

Report bugs here:

https://github.com/Mehran-user/muffinctl/issues

---

Related

- "wmctrl"
- "gdbus"
- Cinnamon
- Muffin