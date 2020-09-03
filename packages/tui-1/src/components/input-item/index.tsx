import React, { forwardRef } from "react";
import { InputItem } from "antd-mobile";
import { InputItemPropsType } from 'antd-mobile/es/input-item/PropsType';

import './index.less';

interface AInputItemProps extends InputItemPropsType {
}
const AInputItem: React.FC<AInputItemProps> = forwardRef(({ children, ...rest }, _ref) => {
    const defaultClassName = 'tui-input-item';
    return (<span className={defaultClassName}>
        <InputItem {...rest} />
    </span>);
});

export default AInputItem;
