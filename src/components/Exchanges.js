import React, { useState, useEffect } from "react";
import { Collapse, Row, Col, Typography, Avatar, Select } from "antd";
import Loader from "./Loader";
import {
  useGetCoinExchangeQuery,
  useGetCryptosQuery,
} from "../services/cryptoApi";
import {
  MoneyCollectOutlined,
  DollarCircleOutlined,
  FundOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const genericStats = [
  {
    Title: "Price: ",
    Icon: <DollarCircleOutlined />,
    Value: "price",
  },
  {
    Title: "Number of Markets: ",
    Icon: <MoneyCollectOutlined />,
    Value: "numberOfMarkets",
  },
  {
    Title: "Btc Price: ",
    Icon: <ThunderboltOutlined />,
    Value: "btcPrice",
  },
  {
    Title: "24 Hours Volume: ",
    Icon: <FundOutlined />,
    Value: "24hVolume",
  },
  {
    Title: "Recommended: ",
    Icon: <ExclamationCircleOutlined />,
    Value: "recommended",
  },
];

const Exchanges = () => {
  const [curId, setCurId] = useState("Qwsogvtv82FCd");
  const [category, setCategory] = useState("Bitcoin");
  const { data } = useGetCryptosQuery(100);
  const { data: coinData, isLoading } = useGetCoinExchangeQuery(curId);

  useEffect(() => {
    const newData = data?.data?.coins?.filter((coin) => category === coin.name);
    setCurId(newData[0]?.uuid);
    // console.log(newData[0].uuid);
  }, [category, data]);

  if (isLoading) {
    return <Loader />;
  }

  const coinExchange = coinData?.data?.exchanges;
  // console.log(coinData);
  // console.log(coinExchange);
  // console.log(data);

  return (
    <>
      <Row>
        <Col span={12}>
          <Title level={2}>Exchanges</Title>
        </Col>
        <Col span={12}>
          <Select
            showSearch
            className="select-news"
            placeholder="Select a Crypto"
            optionFilterProp="children"
            onChange={(value) => setCategory(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {data?.data?.coins.map((coin) => (
              <Option key={coin.uuid} value={coin.name}>
                {coin.name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Collapse defaultActiveKey={["1"]}>
            {coinExchange.map((exchange) => (
              <Panel
                key={exchange.uuid}
                showArrow={false}
                header={
                  <Row key={exchange.uuid}>
                    <Col span={24}>
                      <Text>
                        <strong>{exchange.rank}. </strong>
                      </Text>
                      <Avatar
                        className="exchange-image"
                        src={exchange.iconUrl}
                      />
                      <Text>
                        <strong>{exchange.name}</strong>
                      </Text>
                    </Col>
                  </Row>
                }
              >
                {genericStats.map((obj) => (
                  <Row>
                    <Col span={6}>
                      <Title level={5}>
                        <Text>{obj.Icon}</Text>
                        <Text> </Text>
                        <Text>
                          <strong>{obj.Title}</strong>
                        </Text>
                      </Title>
                    </Col>
                    <Col>
                      {obj.Value !== "recommended"
                        ? exchange[`${obj.Value}`]
                        : "True"}
                    </Col>
                  </Row>
                ))}
              </Panel>
            ))}
          </Collapse>
        </Col>
      </Row>
    </>
  );
};

export default Exchanges;
