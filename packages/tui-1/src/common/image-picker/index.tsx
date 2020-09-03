import React, { useMemo } from 'react'
import cx from 'classnames/bind'
import { ImagePicker, Toast } from 'antd-mobile'
import AFormField from '../../components/form-field';
import { Noop } from '../../types';
import './index.less'

interface AImagePickerProps {
    form: any;
    rules?: Noop[];
    fieldOptions?: Noop;
    title?: string | React.ReactElement;
    limit?: number;
    itemName?: string;
    imagePickerClick?: (...args: any) => {};
    uploadAllFile: (imgList: any[]) => Promise<any[]>;
    required?: boolean;
}

const AImagePicker: React.FC<AImagePickerProps> = ({
    form,
    title,
    limit = 8,
    itemName = 'files',
    imagePickerClick,
    uploadAllFile,
    rules = [],
    fieldOptions = {},
    required = false,
}) => {
    const { getFieldProps, getFieldValue, getFieldError, setFieldsValue } = form
    const imagePickerChange = async (files: any[]) => {
        try {
            let _files: any[] = files.slice()
            if (files.length >= limit) {
                if (files.length > limit) {
                    Toast.info(`最多上传${limit}张图片`)
                }
                _files = files.slice(0, limit)
            }
            const _res = (await uploadAllFile(_files)) as any
            const res = _res.map((item: any, index: any) =>
                Object.assign(item, files[index], {
                    ossKey: `${item.taskcenterUrl}`,
                    uri: `${item.taskcenterUrl}`
                })
            )
            setFieldsValue({
                [itemName]: res
            })
        } catch (error) { }
    }

    const fieldError = useMemo(() => {
        const errors = getFieldError(itemName)
        if (errors && errors.length > 0) {
            return errors.join(',')
        }
        return null
    }, [itemName, getFieldError(itemName)])

    const imagePickerChangeClick = (index: any, files: any) => {
        imagePickerClick && imagePickerClick(index, files)
    }
    return (
        <AFormField
            form={form}
            extraItem={
                <div className={cx('tui-image-picker')}>
                    <div className={cx('remark-title', { required })}>{title || '附件'}</div>
                    <div className={cx('remark')}>
                        <ImagePicker
                            {...getFieldProps(itemName, {
                                valuePropName: 'files',
                                rules: [
                                    {
                                        required,
                                        message: `请选择${title}`
                                    },
                                    ...rules,
                                ],
                                ...fieldOptions,
                            })}
                            accept="image/*"
                            onChange={imagePickerChange}
                            onImageClick={imagePickerChangeClick}
                            selectable={
                                limit >
                                ((getFieldValue(itemName) && getFieldValue(itemName).length) ||
                                    0)
                            }
                            multiple
                        />
                        {fieldError && <div className={cx('error')}>{fieldError}</div>}
                    </div>
                </div >
            }
        />
    )
}

export default AImagePicker
