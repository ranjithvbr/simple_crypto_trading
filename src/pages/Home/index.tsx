import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DropdownButton from "../../component/DropdownButton";
import {
  CryptoAssetsResponse,
  getCryptoList,
} from "../../store/features/cryptoAssets";
import "./home.scss";

interface cryptoListParams {
  cryptoAssets: {
    data: {
      data: CryptoAssetsResponse[];
    };
    isLoading: boolean;
  };
}

const dropDownOptions = [
  {
    id: 1,
    value: "Buy",
  },
  {
    id: 2,
    value: "Sell",
  },
];

export default function Home() {
  const [noOfList, setNoOfList] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderedList, setOrderedList] = useState<CryptoAssetsResponse[]>([]);
  const dispatch = useDispatch();
  const crytoList = useSelector(
    (state: cryptoListParams) => state.cryptoAssets.data.data || []
  );
  const loader: boolean = useSelector(
    (state: cryptoListParams) => state.cryptoAssets.isLoading
  );
  const crytoListLength = crytoList.length;

  useEffect(() => {
    setIsLoading(loader);
  }, [loader])

  useEffect(() => {
    setOrderedList(crytoList);
  }, [crytoListLength]);

  useEffect(() => {
    dispatch(getCryptoList());
  }, [dispatch]);

  const fixedDecimal = useCallback((x: string) => {
    return Number.parseFloat(x).toFixed(2);
  }, []);

  const setList = useCallback(() => {
    setNoOfList(noOfList === 10 ? 20 : 10);
  }, [noOfList]);

  const compareName = useCallback(
    (a: CryptoAssetsResponse, b: CryptoAssetsResponse) => {
      let comparison = 0;
      if (a.name > b.name) {
        comparison = 1;
      } else if (a.name < b.name) {
        comparison = -1;
      }
      return comparison;
    },
    []
  );

  const sortName = useCallback(
    (direction?: "reverse") => {
      if (direction === "reverse") {
        setOrderedList(crytoList.slice().sort(compareName).reverse());
        return;
      }
      setOrderedList(crytoList.slice().sort(compareName));
    },
    [compareName, crytoList]
  );

  const comparePrice = useCallback(
    (a: CryptoAssetsResponse, b: CryptoAssetsResponse) => {
      let price1 = a.metrics.market_data.price_usd;
      let price2 = b.metrics.market_data.price_usd;
      let comparison = 0;
      if (price1 > price2) {
        comparison = 1;
      } else if (price1 < price2) {
        comparison = -1;
      }
      return comparison;
    },
    []
  );

  const sortPrice = useCallback(
    (direction?: "reverse") => {
      if (direction === "reverse") {
        setOrderedList(crytoList.slice().sort(comparePrice).reverse());
        return;
      }
      setOrderedList(crytoList.slice().sort(comparePrice));
    },
    [comparePrice, crytoList]
  );

  return (
    <>
      {isLoading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="homePageContainer">
          <div className="seeMore">
            <div>Total Assets: {noOfList}</div>
            <div onClick={setList}>
              {noOfList === 10 ? "See More" : "See Less"}
            </div>
          </div>
          <table className="coinListTable">
            <thead>
              <tr>
                <th>
                  Coin Name{" "}
                  <span>
                    <span onClick={() => sortName()}>^</span>
                    <span
                      onClick={() => sortName("reverse")}
                      className="downArrow"
                    >
                      ^
                    </span>
                  </span>
                </th>
                <th>
                  Price{" "}
                  <span>
                    <span onClick={() => sortPrice()}>^</span>
                    <span
                      onClick={() => sortPrice("reverse")}
                      className="downArrow"
                    >
                      ^
                    </span>
                  </span>
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orderedList.map((data: CryptoAssetsResponse, index: number) => {
                if (index < noOfList) {
                  return (
                    <tr key={data.id} className="coinDetailRow">
                      <td>
                        <span>{data.name[0]}</span>
                        <span>{data.name}</span>
                        <span>{data.symbol}</span>
                      </td>
                      <td>
                        ${fixedDecimal(data.metrics.market_data.price_usd)}
                      </td>
                      <td>
                        <DropdownButton
                          options={dropDownOptions}
                          defaultvalue={"Buy"}
                        />
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
