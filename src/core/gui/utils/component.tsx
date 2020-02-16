let propsToStyle = (properties: any) => {
    let style: any = {
        position: 'absolute' as 'absolute'
    };

    let exceptions = [
        'name',
        'value'
    ];
    for(let i=0;i<properties.length;i++) {
        let property = properties[i];
        let name = property.property_name.toLowerCase();
        if(exceptions.indexOf(name) > -1) continue;

        switch(name) {
            case 'position':
                if(typeof(property.sub_properties) !== 'undefined') {
                    style['top'] = `${property.sub_properties['y']}px`;
                    style['left'] = `${property.sub_properties['x']}px`;
                }
                break;
        }
    }

    return style;
};

export {
    propsToStyle
}