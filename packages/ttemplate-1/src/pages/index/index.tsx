/* eslint-disable import/no-extraneous-dependencies */
import React, { useCallback, useState, useEffect } from 'react';
import {
  AButton,
  AFormField,
  AInputItem,
  AImagePicker,
  ATextArea,
  ASwitchItem,
  AAreaPickerItem,
  AChooseModalItem,
  AMultyFormModal,
  ACalendarFormItem,
} from 'tui-1';
import { createForm, formShape } from 'rc-form';
import { uploadAllFile } from '@/utils/index';
import regExp from '@/utils/regExp';
import classnames from 'classnames/bind';

import styles from './index.less';

const cx = classnames.bind(styles);

interface IndexProps {
  form: formShape;
}

interface SinglePickerData {
  label: string;
  value: string;
}

const concatType: SinglePickerData[] = [
  { label: '仅手机', value: '1' },
  { label: '仅固定电话', value: '2' },
  { label: '手机和固定电话', value: '3' },
];

const Index: React.FC<IndexProps> = ({ form }) => {
  const {
    getFieldDecorator,
    setFieldsValue,
    getFieldValue,
    getFieldError,
    validateFields,
  } = form;

  const submit = useCallback(() => {
    validateFields(async (errors, values) => {
      console.log(26, errors, values);
    });
  }, []);

  return (
    <div className={cx('index-wrap')}>
      <AFormField
        label="租赁备案证号"
        content={
          <AInputItem maxLength={80} clear placeholder="请输入租赁备案证号" />
        }
        required
        itemName="houseFileNumber"
        form={form}
      />
      <AFormField
        label="联系方式"
        required
        itemName="concatType"
        form={form}
        type="picker"
        pickerData={concatType}
      />
      <AFormField
        label="曾用名/别名"
        itemName="usedname"
        form={form}
        content={<AInputItem clear placeholder="请输入曾用名/别名" />}
        rules={[
          {
            pattern: regExp.chineseName,
            message: '曾用名/别名不符合规范',
          },
          // {
          //   validator: (rule, value, callback) => {
          //     callback('哈哈哈')
          //   },
          // },
        ]}
      />
      <AImagePicker
        form={form}
        title="图片"
        uploadAllFile={uploadAllFile}
        required
      />
      <ATextArea required form={form} count={100} />
      <ASwitchItem form={form} itemName="aaa" title="asas" required />
      <AAreaPickerItem
        title="城市选择"
        form={form}
        itemName="cityChoose"
        organizationListChild={() => {}}
        organizationGetRoot={() => {}}
      />
      <AChooseModalItem
        form={form}
        required
        requiredTips="请选择选择弹窗"
        title="选择弹窗"
        fetchFn={() => Promise.resolve({ data: [] })}
        modalTitle="选择弹窗123"
      />
      <AMultyFormModal
        form={form}
        itemName="multyform"
        label="多选"
        required
        initPanes={Promise.resolve([
          {
            id: 1,
            name: '1',
          },
          {
            id: 2,
            name: '2',
          },
          {
            id: 3,
            name: '3',
          },
        ])}
      />
      <ACalendarFormItem
        form={form}
        itemName="calendar"
        label="时间段"
        required
      />
      <AButton type="primary" onClick={submit}>
        primary
      </AButton>
    </div>
  );
};

export default createForm()(Index);
