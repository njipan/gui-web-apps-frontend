let propsToStyle = (properties: any) => {
    let style: any = {
        position: 'absolute' as 'absolute',
        cursor: 'default' as 'default'
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

let getName = (properties: any, defaultValue: any) => {
    let nameProp = properties.find((v: any) => {
        return v.property_name.toLowerCase() === 'value';
    });
    let text = typeof(nameProp) !== 'undefined' && nameProp.value !== '' ? nameProp.value : defaultValue;
    return text;
}

export {
    propsToStyle,
    getName
}