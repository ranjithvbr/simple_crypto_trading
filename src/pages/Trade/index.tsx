import { useCallback, useState, useEffect } from "react";
import Input from "../../component/Input";
import Modal from "../../component/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  CryptoAssetsResponse,
  getCryptoList,
} from "../../store/features/cryptoAssets";
import { getcurrencyCovertResult } from "../../store/features/currenyConverter";
import Login from "../Login";
import { useNavigate } from "react-router-dom";
import "./trade.scss";

interface cryptoListParams {
  cryptoAssets: {
    data: {
      data: CryptoAssetsResponse[];
    };
    isLoading: boolean;
  };
}

interface TokenParams {
  amountToken: string;
  fiatToken: string;
}

interface ValueParams {
  amountValue: number | "";
  fiatValue: number | "";
}

export default function Trade() {
  const [search, setSearch] = useState<string>("");
  const [selectType, setSelectType] = useState<string>("");
  const [opemModal, setModalOpen] = useState<boolean>(false);
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [swap, setSwap] = useState<boolean>(true);
  const [token, setToken] = useState<TokenParams>({
    amountToken: "",
    fiatToken: "",
  });
  const [value, setValue] = useState<ValueParams>({
    amountValue: "",
    fiatValue: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("isLogin"));
  const crytoList = useSelector(
    (state: cryptoListParams) => state.cryptoAssets.data.data || []
  );
  const loader: boolean = useSelector(
    (state: cryptoListParams) => state.cryptoAssets.isLoading
  );
  const converter: any = useSelector(
    (state: any) => state.currencyConverter.data
  );

  useEffect(() => {
    setIsLoading(loader);
  }, [loader]);

  useEffect(() => {
    dispatch(getCryptoList());
  }, [dispatch]);

  useEffect(() => {
    if (converter?.data?.result) {
      const result =
        (swap ? converter.data.result * Number(value.amountValue) : converter.USDdata.result * Number(value.fiatValue))
        ;
      const fieldName = swap ? "fiatValue" : "amountValue";
      console.log(result, fieldName)
      setValue((prevState) => ({
        ...prevState,
        [fieldName]: result ? result : "",
      }));
    }
  }, [converter]);

  const handleOpenModal = useCallback((type: string) => {
    setModalOpen(true);
    setSelectType(type);
    setSearch("");
  }, []);

  const currencyResult = useCallback(
    (coinSymbol?: string) => {
      const { amountToken, fiatToken }: any = token;
      if (coinSymbol || fiatToken) {
        dispatch(
          getcurrencyCovertResult({
            amount: amountToken || crytoList?.[0]?.symbol,
            fiat: fiatToken ? fiatToken : "USD",
          })
        );
      }
    },
    [crytoList, dispatch, token]
  );

  const handleCoinChange = useCallback(
    (data: string) => {
      setToken((prevState) => ({
        ...prevState,
        [selectType]: data,
      }));
      setModalOpen(false);
      currencyResult(data);
    },
    [currencyResult, selectType]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
      setValue((prevState) => ({
        ...prevState,
        [name]: e.target.value,
      }));
      currencyResult();
    },
    [currencyResult]
  );

  const onChange = useCallback((data: string) => {
    setSearch(data);
  }, []);

  const amoutInput = useCallback(() => {
    return (
      <div className="inputContainer">
        <input
          className="amountInput"
          type="number"
          value={value.amountValue}
          onChange={(e) => handleInputChange(e, "amountValue")}
          placeholder="0.0"
          disabled={!swap}
        />
        <div className="coins" onClick={() => handleOpenModal("amountToken")}>
          {token.amountToken ? (
            <>
              <span>{token.amountToken[0]}</span>
              <span>{token.amountToken}</span>
            </>
          ) : (
            <>
              <span>{crytoList?.[0]?.name[0]}</span>
              <span>{crytoList?.[0]?.symbol}</span>
            </>
          )}
          <span>^</span>
        </div>
      </div>
    );
  }, [crytoList, handleInputChange, handleOpenModal, swap, token.amountToken, value.amountValue]);

  const fiatInput = useCallback(() => {
    return (
      <div className="inputContainer">
        <input
          className="amountInput"
          type="number"
          value={value.fiatValue}
          onChange={(e) => handleInputChange(e, "fiatValue")}
          placeholder="0.0"
          disabled={swap}
        />
        <div className="coins" onClick={() => handleOpenModal("fiatToken")}>
          {token.fiatToken ? (
            <>
              <span>{token.fiatToken[0]}</span>
              <span>{token.fiatToken}</span>
            </>
          ) : (
            <div>Select a token</div>
          )}
          <span>^</span>
        </div>
      </div>
    );
  }, [handleInputChange, handleOpenModal, swap, token.fiatToken, value.fiatValue]);

  const handleSwap = useCallback(() => {
    setSwap(!swap);
  }, [swap]);

  const tokenRate = converter?.data?.result;
  const USDRate = converter?.USDdata?.result;

  console.log(value.fiatValue, tokenRate)

  return (
    <>
      {isLoggedIn ? (
        isLoading ? (
          <div className="loader">Loading...</div>
        ) : (
          <>
            <div className="tradeContainer">
              <div>
                <h3>Swap</h3>
                {swap ? amoutInput() : fiatInput()}
                <div className="swapArrow" onClick={handleSwap}>
                  ⬇
                </div>
                {!swap ? amoutInput() : fiatInput()}
                {swap && value.amountValue
                  ? USDRate && (
                      <div className="oneRate">{`1 USD = ${USDRate}`}</div>
                    )
                  : tokenRate &&
                    value.amountValue && (
                      <div className="oneRate">{`1 ${
                        token.amountToken || crytoList?.[0]?.symbol
                      } = ${tokenRate}`}</div>
                    )}
              </div>
            </div>
            <Modal
              modalVisible={opemModal}
              closeModal={() => setModalOpen(false)}
            >
              <div className="selectTokenModal">
                <h3>Select a token</h3>
                <Input
                  onChange={onChange}
                  customInputStyle="searchBox"
                  placeholder="Search name"
                />
                <div className="break" />
                <div className="cryptoListContainer">
                  {crytoList.map((data: CryptoAssetsResponse) => {
                    if (
                      data.name.toLowerCase().includes(search.toLowerCase()) ||
                      data.symbol
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      !search
                    ) {
                      return (
                        <div
                          key={data.id}
                          className="cryptoList"
                          onClick={() => handleCoinChange(data.symbol)}
                        >
                          <div>{data.name[0]}</div>
                          <div className="cryptoNameList">
                            <div>{data.symbol}</div>
                            <div>{data.name}</div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </Modal>
          </>
        )
      ) : (
        <Login
          reload
          modalVisible={openLoginModal}
          closeModal={() => {
            setOpenLoginModal(false);
            navigate("/");
          }}
        />
      )}
    </>
  );
}
