#Requires AutoHotkey v2.0

#Requires AutoHotkey v2.0
#SingleInstance Force

; -------------------------------------------------------------------------
; CYBER MATRIX QUICK COMMANDS
; -------------------------------------------------------------------------

; Press Ctrl + Alt + G to quickly open your GitHub Repository
^!g:: {
    Run "https://github.com/cyberchris-ai/cyberchris-ai.github.io"
}

; Press Ctrl + Alt + C to open your 3D Chess game
^!c:: {
    Run "https://cyberchris-ai.github.io/chess3d.html"
}

; Press Alt + R to Reload this script after making changes
!r:: {
    MsgBox "Reloading Cyber Script...", "System", "Iconi T2"
    Reload
}

; -------------------------------------------------------------------------
; TACTICAL SHORTCUTS
; -------------------------------------------------------------------------

; Type "cmsig" then Space to auto-type your project signature
::cmsig::CYBER_MATRIX_SYSTEM_v1.0

; Typing "logic?" displays a quick system status message
::logic?::
{
    MsgBox "All systems nominal. Matrix connection stable.", "Cyber Matrix HUD"
}
