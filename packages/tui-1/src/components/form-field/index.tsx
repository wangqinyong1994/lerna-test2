import React, { ReactElement, FormEvent, useMemo, useCallback } from 'react';
import { Picker } from 'antd-mobile';
import cx from 'classnames/bind';
import { Noop, SinglePickerData } from '../../types';
import IconRight from '../_assets/images/icon_right.png';

import './index.less';

// type: input | picker ...

interface FormFieldProps {
    label?: string | ReactElement;
    controlClassName?: string;
    extraItem?: ReactElement;
    labelImg?: ReactElement | null;
    className?: string;
    content?: any;
    onClick?: (event: FormEvent<HTMLDivElement>) => void;
    form?: any;
    itemName?: string;
    required?: boolean;
    rules?: Noop[];
    fieldOptions?: Noop;
    type?: 'input' | 'picker';
    pickerData?: SinglePickerData[];
}

const FormField: React.FunctionComponent<FormFieldProps> = ({
    label,
    extraItem,
    labelImg,
    controlClassName,
    className,
    content,
    onClick,
    form,
    itemName,
    required,
    rules = [],
    fieldOptions = {},
    type = 'input',
    pickerData = [],
}) => {
    const {
        getFieldDecorator,
        getFieldValue,
        getFieldError,
    } = form;
    const fieldError = useMemo(() => {
        const errors = getFieldError(itemName);
        if (errors && errors.length > 0) {
            return errors.join(',')
        }
        return null
    }, [itemName, getFieldError(itemName)]);

    const renderPickerText = useCallback((name, arr) => {
        const value = getFieldValue(name) && getFieldValue(name)[0];
        if (value || value === 0) {
            const target = arr.find((item: any) => item.value === value);
            if (target) {
                return target.label;
            }
        }
        return null;
    }, [])

    const renderPickerDom = useCallback(({ label, itemName, pickerData }) => {
        const isGrew = !!!renderPickerText(itemName, pickerData);
        return (<div className={cx('text-dom', { 'text-dom-grew': isGrew })}>
            {renderPickerText(itemName, pickerData) || `请选择${label}`}
        </div>)
    }, [label, itemName, pickerData])

    const renderMainDom = useCallback((domType) => {
        if (domType === 'input') {
            return getFieldDecorator(itemName, {
                rules: [
                    {
                        required,
                        message: `请输入${label}`
                    },
                    ...rules,
                ],
                ...fieldOptions,
            })(content)
        }
        if (domType === 'picker') {
            return getFieldDecorator(itemName, {
                rules: [
                    {
                        required,
                        message: `请选择${label}`
                    },
                    ...rules,
                ],
                ...fieldOptions,
            })(<Picker title={label} data={pickerData} cols={1}>{content || renderPickerDom({ label, itemName, pickerData })}</Picker>)
        }
        return null
    }, [type, pickerData])

    return (
        <div className={cx('tui-formfield', className)} onClick={onClick}>
            {extraItem || (
                <div
                    className={cx('control', controlClassName)}
                >
                    <div className={cx('header')}>
                        <div className={cx('label', { required })}>{label}</div>
                        {type === 'picker' ? labelImg ?? <img src={IconRight} alt="IconRight" /> : labelImg}
                    </div>
                    <div className={cx('content')}>
                        {renderMainDom(type)}
                    </div>
                    {
                        fieldError && <div className={cx('error')}>{fieldError}</div>
                    }
                </div>
            )}
        </div>
    );
};

export default FormField;
