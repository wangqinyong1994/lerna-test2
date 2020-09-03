import React from 'react';
import { Switch } from 'antd-mobile';
import cx from 'classnames/bind';

import './index.less';


interface ASwitchItemProps {
    form: any;
    title?: string | React.ReactElement;
    itemName: string;
    checked?: boolean;
    onChangeHandler?: Function;
}

const ASwitchItem: React.FC<ASwitchItemProps> = ({
    form,
    title,
    itemName,
    checked = false,
    onChangeHandler,
}) => {
    const { getFieldProps, setFieldsValue } = form;
    return (
        <div className={cx('tui-switch-item')}>
            <div className={cx('title')}>{title}</div>
            <Switch
                {...getFieldProps(itemName, {
                    initialValue: checked,
                    valuePropName: 'checked',
                })}
                color="#4A7EFE"
                onClick={(checked) => {
                    if (onChangeHandler) {
                        onChangeHandler(checked);
                    }
                    setFieldsValue({
                        [itemName]: checked,
                    });
                }}
            />
        </div>
    );
};

export default ASwitchItem;
