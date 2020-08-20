import React from "react";
import { Button } from "antd-mobile";
import { ButtonPropsType } from 'antd-mobile/es/button/PropsType';

interface AButtonProps extends ButtonPropsType {
    text: string | React.ReactNode;
}
const AButton: React.FC<AButtonProps> = ({ text, ...rest }) => {
    return (<Button {...rest}>{text}</Button>);
};

export default AButton;
