import React, { useState, useCallback, useMemo } from 'react'
import cx from 'classnames/bind'
import { SearchBar, ActivityIndicator, Modal } from 'antd-mobile'
import debounce from 'lodash/debounce'
import AFormField from '../../components/form-field'
import { Noop } from '../../types'

import './index.less'

interface ListItem extends Noop {
  id: number
  ifUsed: boolean
  fullAddress: string
}

interface ChooseModalItemProps {
  form: any
  title?: string
  itemName?: string
  required?: boolean
  fetchFn: (...args: any) => Promise<any>
  modalTitle?: string
  requiredTips?: string
}

const ChooseModalItem: React.FC<ChooseModalItemProps> = ({
  form,
  title,
  itemName = 'address',
  required = false,
  fetchFn,
  modalTitle = '',
  requiredTips
}) => {
  const [visible, setVisible] = useState(false)
  const [list, setList] = useState<ListItem[]>([])
  const [markText, setMarkText] = useState('')
  const [isLoading, setLoading] = useState(false)
  const { setFieldsValue, getFieldValue } = form
  const onChange = debounce(async val => {
    try {
      if (val) {
        setLoading(true)
        const { data } = await fetchFn()
        setList(data)
        setMarkText(val)
      } else {
        setList([])
        setMarkText('')
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, 500)

  const reset = () => {
    setList([])
    setMarkText('')
    setLoading(false)
    setVisible(false)
  }

  const chooseAddress = useCallback((item: ListItem) => {
    setFieldsValue({
      [itemName]: item
    })
    reset()
  }, [])

  const onClose = () => {
    reset()
  }

  const renderChooseModalText = useMemo(() => {
    const val = getFieldValue(itemName)
    if (val) {
      return val.fullAddress || val.currentAddress
    }
    return `请选择${title}`
  }, [getFieldValue(itemName), title])

  const renderList = () => {
    if (isLoading) {
      return <ActivityIndicator toast text="加载中..." animating />
    }
    if (list && list.length > 0) {
      return (
        <div className={cx('list-wrap')}>
          {list.map((item: ListItem) => (
            <AFormField
              key={item.id}
              form={form}
              extraItem={
                <div className={cx('card-wrap')}>
                  <div className={cx('line1')}>{item.fullAddress}</div>
                  <div
                    className={cx('line2')}
                    onClick={() => chooseAddress(item)}
                  >
                    选择
                  </div>
                </div>
              }
            />
          ))}
        </div>
      )
    }
    if (markText && !list.length) {
      return <div className={cx('loading')}>无内容</div>
    }
    return null
  }

  return (
    <>
      <AFormField
        label={title}
        itemName={itemName}
        form={form}
        controlClassName="choose-modal-formfield"
        content={
          <div
            className={cx('text-dom', {
              active: renderChooseModalText?.indexOf('请选择') > -1
            })}
            onClick={() => setVisible(true)}
          >
            {renderChooseModalText}
          </div>
        }
        required={required}
        requiredTips={requiredTips}
      />
      <Modal
        title={modalTitle}
        visible={visible}
        popup
        closable
        onClose={onClose}
        animationType="slide-up"
        wrapClassName={cx('tui-choose-modal')}
      >
        <div className={cx('choose-wrap')}>
          <div className={cx('search-wrap')}>
            <SearchBar onChange={onChange} placeholder="选择地址" />
          </div>
          {renderList()}
        </div>
      </Modal>
    </>
  )
}

export default ChooseModalItem
