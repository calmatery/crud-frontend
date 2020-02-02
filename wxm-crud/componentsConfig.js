export const basicComponents = [
    {
        type: 'input',
        name: '输入框',
        _icon: 'icon-textarea',
        defaultValue: '',
        placeholder: '',
    },
    {
        type: 'datePicker',
        name: '日期选择',
        _icon: 'icon-fuhao-shuzishurukuang',
        placeholder:''
    },
    {
        type: 'input',
        name: '测试',
        _icon: 'icon-fuhao-shuzishurukuang'
    }
]

export const layoutComponents = [
    {
        type: 'grid',
        name: '栅格',
        _icon: 'icon-rectangle_grid_x_fill',
        cols:[
            {
                span:12,
                list:[]
            },
            {
                span:12,
                list:[]
            }
        ]
    }
]
