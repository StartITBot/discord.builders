export default [
    {
        "type": 17,
        "accent_color": 9225410,
        "spoiler": false,
        "components": [
            {
                "type": 10,
                "content": "Example components:"
            },
            {
                "type": 10,
                "content": "\nButtons"
            },
            {
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "style": 5,
                        "label": "Buttons that",
                        "emoji": null,
                        "disabled": false,
                        "url": "https://google.com"
                    },
                    {
                        "type": 2,
                        "style": 1,
                        "label": "you can",
                        "emoji": null,
                        "disabled": false,
                        "custom_id": "36acfad8d418474084daed1d0d06bef2"
                    },
                    {
                        "type": 2,
                        "style": 2,
                        "label": "drag around",
                        "emoji": null,
                        "disabled": false,
                        "custom_id": "212dc1a845d54912cdff8446cdb3d321"
                    }
                ]
            },
            {
                "type": 10,
                "content": "\nSelect menus"
            },
            {
                "type": 1,
                "components": [
                    {
                        "type": 3,
                        "custom_id": "99fca274f90a4070beb7086fdf335bfc",
                        "options": [
                            {
                                "label": "Test selection",
                                "value": "44c530edcff948c5e63764303419e252",
                                "description": "test",
                                "emoji": {
                                    "id": null,
                                    "name": "😜"
                                },
                                "default": true,
                                "disabled": false
                            },
                            {
                                "label": "Other selection",
                                "value": "c0f60f084fc44e99ec904a89f83ffaf6",
                                "description": null,
                                "emoji": null,
                                "default": false,
                                "disabled": false
                            }
                        ],
                        "placeholder": "",
                        "min_values": 1,
                        "max_values": 3,
                        "disabled": false
                    }
                ]
            },
            {
                "type": 10,
                "content": "\nFiles"
            },
            {
                "type": 13,
                "file": {
                    "url": "attachment://secret-file.pdf"
                },
                "spoiler": false
            },
            {
                "type": 10,
                "content": "\nImages"
            },
            {
                "type": 12,
                "items": [
                    {
                        "media": {
                            "url": "https://avatars.githubusercontent.com/u/77593673?s=128"
                        },
                        "description": null,
                        "spoiler": false
                    }
                ]
            }
        ]
    }
]