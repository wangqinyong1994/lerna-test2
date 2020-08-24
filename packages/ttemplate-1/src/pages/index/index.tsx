/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { AButton } from 'tui-1';
import classnames from 'classnames/bind';

import styles from './index.less';

const cx = classnames.bind(styles);

interface IndexProps {}

const Index: React.FC<IndexProps> = () => (
  <div className={cx('index-wrap')}>
    <AButton type="primary" text="primary"></AButton>
  </div>
);

export default Index;
