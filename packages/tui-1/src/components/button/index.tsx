import React from "react";
import { Button } from "antd-mobile";
import { ButtonPropsType } from 'antd-mobile/es/button/PropsType';

import './index.less';

interface AButtonProps extends ButtonPropsType {
}
const AButton: React.FC<AButtonProps> = ({ children, ...rest }) => {
    const defaultClassName = 'tui-button';
    return (<span className={defaultClassName}>
        <Button {...rest}>{children}</Button>
    </span>);
};

export default AButton;
