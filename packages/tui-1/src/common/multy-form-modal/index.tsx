import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useMemo
} from 'react'
import { Modal } from 'antd-mobile'
import cx from 'classnames/bind'
import { Noop } from '../../types'
import AFormField from '../../components/form-field'
import IconTick from '../../components/_assets/images/icon_tick.png'

import './index.less'

interface MultyFormModalProps {
  label: string
  form: any
  initPanes: any[] | Promise<any>
  itemName: string
  required?: boolean
  async?: boolean
  tips?: string
  confirmHandler?: (...args: any) => void
}

const MultyFormModal = forwardRef(
  (
    {
      label,
      required = false,
      async = false,
      tips = '',
      form,
      confirmHandler,
      initPanes = [],
      itemName
    }: MultyFormModalProps,
    ref
  ) => {
    const [visible, setVisible] = useState(false)
    const [panes, setPanes] = useState<any[]>(
      JSON.parse(JSON.stringify(initPanes))
    )
    const [savedPanes, setSavedPanes] = useState<any[]>(
      JSON.parse(JSON.stringify(initPanes))
    )
    useImperativeHandle(ref, () => ({
      panes: savedPanes.filter(item => item.checked)
    }))

    const { setFieldsValue, getFieldValue } = form
    const getInitValue = async () => {
      if (!async) {
        const res = await initPanes
        setPanes(JSON.parse(JSON.stringify(res)))
        setSavedPanes(JSON.parse(JSON.stringify(res)))
      } else {
        const _res = await initPanes
        const res = _res.map((item: Noop) => ({
          id: item.id,
          name: item.displayname,
          checked: item.checked || false
        }))
        setPanes(JSON.parse(JSON.stringify(res)))
        setSavedPanes(JSON.parse(JSON.stringify(res)))
      }
    }

    useEffect(() => {
      getInitValue()
    }, [])
    const choosePlace = (item: Noop) => {
      const _panes = panes.slice().map(paneItem => {
        if (paneItem.id === item.id) {
          paneItem.checked = !item.checked
        }
        return paneItem
      })
      setPanes(_panes)
    }

    const confirm = () => {
      if (confirmHandler) {
        confirmHandler(panes.filter(item => item.checked))
      }
      setFieldsValue({
        [itemName]: panes
      })
      setSavedPanes(JSON.parse(JSON.stringify(panes)))
      setVisible(false)
    }

    const cancel = () => {
      setVisible(false)
      setPanes(JSON.parse(JSON.stringify(savedPanes)))
    }

    const renderMultyText = useMemo(() => {
      let arr = panes && panes.length && panes.filter(item => item.checked)
      if (getFieldValue(itemName) && getFieldValue(itemName).length) {
        arr = getFieldValue(itemName).filter((item: Noop) => item.checked)
      }
      let ret = ''
      if (arr && arr.length) {
        arr.forEach(item => {
          ret += `${item.name};`
        })
        return ret
      }
      return tips || `请选择${label}`
    }, [panes, getFieldValue(itemName), tips])

    return (
      <>
        <AFormField
          label={label}
          required={required}
          requiredTips={`请选择${label}`}
          form={form}
          itemName={itemName}
          controlClassName="tui-multy-formfield"
          content={
            <div
              className={cx('text-dom', {
                active: renderMultyText?.indexOf('请选择') > -1
              })}
              onClick={() => {
                getFieldValue(itemName) &&
                  setPanes(JSON.parse(JSON.stringify(getFieldValue(itemName))))
                getFieldValue(itemName) &&
                  setSavedPanes(
                    JSON.parse(JSON.stringify(getFieldValue(itemName)))
                  )
                setVisible(true)
              }}
            >
              {renderMultyText}
            </div>
          }
        />
        <Modal
          wrapClassName={cx('tui-multy-modal')}
          popup
          visible={visible}
          onClose={cancel}
          animationType="slide-up"
          title={
            <div className={cx('title')}>
              <div className={cx('title-left')} onClick={cancel}>
                取消
              </div>
              <div className={cx('title-content')}>{label}</div>
              <div className={cx('title-right')} onClick={confirm}>
                确认
              </div>
            </div>
          }
        >
          {panes &&
            panes.length > 0 &&
            panes.map((item: any) => (
              <div
                key={item.id}
                className={cx('content-item', { active: item.checked })}
                onClick={() => choosePlace(item)}
              >
                <span>{item.name}</span>
                {item.checked && <img src={IconTick} alt="IconTick" />}
              </div>
            ))}
        </Modal>
      </>
    )
  }
)

export default MultyFormModal
