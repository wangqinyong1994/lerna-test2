import React, { useMemo } from 'react';
import { TextareaItem } from 'antd-mobile';
import cx from 'classnames/bind';
import { TextAreaItemPropsType } from 'antd-mobile/es/textarea-item/PropsType';
import AFormField from '../../components/form-field';
import { Noop } from '../../types';


import './index.less';

interface ATextAreaProps extends TextAreaItemPropsType {
    form: any;
    title?: string | React.ReactElement;
    itemName: string;
    required?: boolean;
    rules?: Noop[];
    fieldOptions?: Noop;
}

const ATextAreaItem: React.FC<ATextAreaProps> = ({
    form,
    title = '备注',
    itemName = 'remarks',
    required = false,
    rules = [],
    fieldOptions = {},
    ...rest
}) => {
    const { getFieldProps, getFieldError } = form;

    const fieldError = useMemo(() => {
        const errors = getFieldError(itemName)
        if (errors && errors.length > 0) {
            return errors.join(',')
        }
        return null
    }, [itemName, getFieldError(itemName)])

    return (
        <AFormField
            form={form}
            extraItem={
                <div className={cx('tui-text-area')}>
                    <div className={cx('remark-title', { required })}>{title}</div>
                    <div className={cx('remark')}>
                        <TextareaItem
                            {...rest}
                            placeholder={`请输入${title}`}
                            {...getFieldProps(itemName, {
                                rules: [
                                    {
                                        required,
                                        message: `请输入${title}`
                                    },
                                    ...rules,
                                ],
                                ...fieldOptions,
                            })}
                            rows={3}
                        />
                    </div>
                    {fieldError && <div className={cx('error')}>{fieldError}</div>}
                </div>
            }
        />
    );
};

export default ATextAreaItem;
