import { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Divider, message, BackTop, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useSubstrate } from './substrate-lib';
import { coin } from './config/coin'
const { Option } = Select
function Management() {
    const { api } = useSubstrate();
    const [loadAdd, setLoadAdd] = useState(false);
    const [currentIndexes, setCurrentIndexes] = useState([]);
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        const { name, id, assets } = values;
        let alice = keyring.getPairs()[0];
        try {
            setLoadAdd(true)
            await api.tx.stoneIndex.addIndex(id, name, assets).signAndSend(alice);
            setLoadAdd(false)
            message.success("Add Successed")
            form.resetFields()
        } catch (error) {
            message.success("Add Failed")
        }
    };

    useEffect(() => {
        let unsubscribe;
        api.query.stoneIndex.indexes.entries(newValue => {
            setCurrentIndexes(newValue.map(i => i[1]));
        }).then(unsub => {
            unsubscribe = unsub;
        }).catch(console.error);
        // 提交后查询数据不会马上刷新，有延时
        setTimeout(() => {
            api.query.stoneIndex.indexes.entries(newValue => {
                setCurrentIndexes(newValue.map(i => i[1]));
            }).then(unsub => {
                unsubscribe = unsub;
            }).catch(console.error);
        }, 2000)

        setTimeout(() => {
            api.query.stoneIndex.indexes.entries(newValue => {
                setCurrentIndexes(newValue.map(i => i[1]));
            }).then(unsub => {
                unsubscribe = unsub;
            }).catch(console.error);
        }, 4000)

        return () => unsubscribe && unsubscribe();
    }, [api.query.stoneIndex, loadAdd]);

    return (
        <>
            <BackTop />
            <Divider orientation="left">Add</Divider>
            <div className="manage-container">
                <Form
                    form={form}
                    onFinish={onFinish}
                    name="dynamic_form_nest_item"
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        assets: [{}]
                    }}
                >
                    <Row>
                        <Col span={11}>
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Missing Name!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={11}>
                            <Form.Item
                                label="Id"
                                name="id"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Missing Id!',
                                    },
                                ]}
                            >
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.List name="assets">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ field }, index) => (
                                    <Row key={index}>
                                        <Col span={11}>
                                            <Form.Item
                                                label="Asset Id"
                                                name={[index, 'assetId']}
                                                fieldKey={[index, 'assetId']}
                                                rules={[{ required: true, message: 'Missing Asset Id!' }]}
                                            >
                                                <Select
                                                    placeholder="Select a Asset"
                                                >
                                                    {coin.map((item, index) => (
                                                        <Option key={index} value={index}>{item}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={11}>
                                            <Form.Item
                                                label="Weight"
                                                name={[index, 'weight']}
                                                fieldKey={[index, 'weight']}
                                                rules={[{ required: true, message: 'Missing Weight!' }]}
                                            >
                                                <Input type="number" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <MinusCircleOutlined style={{ paddingTop: '8px' }} onClick={() => remove(index)} />
                                        </Col>
                                    </Row>
                                ))}

                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add Asset
                                </Button>
                            </>
                        )}
                    </Form.List>
                    <div className="botBut">
                        <Button type="primary" loading={loadAdd} className="but" htmlType="submit">
                            Add
                        </Button>
                    </div>
                </Form>
            </div>
            <Divider orientation="left">Update</Divider>
            {currentIndexes.map((index, i) => (
                <SubManage loadWho={i} indexId={index.stoneId.toNumber()} key={index.stoneId.toNumber()}
                    indexName={index.name.toHuman()} components={index.components} />
            ))}
        </>
    )
}

function SubManage(props) {
    const { api } = useSubstrate();
    const [load, setLoad] = useState(-1);
    const { indexName, indexId, components, loadWho } = props;
    const onFinish = async (values) => {
        const { name, id, assets } = values;
        let alice = keyring.getPairs()[0];
        try {
            setLoad(loadWho)
            await api.tx.stoneIndex.addIndex(id, name, assets).signAndSend(alice);
            setLoad(-1)
            message.success("Update Successed")
        } catch (error) {
            message.success("Update Failed")
        }
    };

    return (
        <div className="manage-container">
            <Form
                onFinish={onFinish}
                name="dynamic_form_nest_item"
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                    name: indexName,
                    id: indexId,
                    assets: JSON.parse(JSON.stringify(components))
                }}
            >
                <Row>
                    <Col span={11}>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Missing Name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item
                            label="Id"
                            name="id"
                            rules={[
                                {
                                    required: true,
                                    message: 'Missing Id!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.List
                    name="assets">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ field }, index) => (
                                <Row key={index}>
                                    <Col span={11}>
                                        <Form.Item
                                            label="Asset Id"
                                            name={[index, 'assetId']}
                                            fieldKey={[index, 'assetId']}
                                            rules={[{ required: true, message: 'Missing Asset Id!' }]}
                                        >
                                            <Select
                                                placeholder="Select a Asset"
                                            >
                                                {coin.map((item, index) => (
                                                    <Option key={index} value={index}>{item}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={11}>
                                        <Form.Item
                                            label="Weight"
                                            name={[index, 'weight']}
                                            fieldKey={[index, 'weight']}
                                            rules={[{ required: true, message: 'Missing Weight!' }]}
                                        >
                                            <Input type="number" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <MinusCircleOutlined style={{ paddingTop: '8px' }} onClick={() => remove(index)} />
                                    </Col>
                                </Row>
                            ))}

                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Asset
                            </Button>
                        </>
                    )}
                </Form.List>
                <div className="botBut">
                    <Button type="primary" loading={load == loadWho} className="but" htmlType="submit">
                        Update
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default Management