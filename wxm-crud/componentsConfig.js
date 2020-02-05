export const basicComponents = [
    {
        type: 'button',
        name: '按钮',
        _icon: 'icon-anniu',
        btnType:'primary'
    },
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
        type: 'table',
        name: '报表',
        _icon: 'icon-biaoge',
        cols: [
            {
                title: "列1",
                dataIndex: "col1"
            },
            {
                title: "列2",
                dataIndex: "col2"
            }
        ],
        scopeListeners:[]
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
    },
    {
        type: 'tabs',
        name: '标签页',
        _icon: 'icon-tabs',
        tabs:[
            {
                name:'新标签页',
                list:[]
            }
        ]
    },
    {
        type: 'divider',
        name: '分割线',
        _icon: 'icon-fengexian',
        orientation:'left',
        dashed:false
    },
    {
        type: 'scopeGateway',
        name: '作用域网关',
        _icon: 'icon-wangguan',
        list:[]
    }
]
