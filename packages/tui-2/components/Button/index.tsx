import React from "react";
import { Button } from "antd-mobile";
import { ButtonPropsType } from 'antd-mobile/es/button/PropsType';

interface AButtonProps extends ButtonPropsType {
}
const AButton: React.FC<AButtonProps> = ({ children, ...rest }) => {
    return (<Button {...rest}>{children}</Button>);
};

export default AButton;
