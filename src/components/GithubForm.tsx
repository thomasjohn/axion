import { FC, useState, useRef } from "react";
import { GithubResults } from "./GithubResults";
import { api } from "../api/api";

// const
const ACCOUNT_VALUES = ["user", "organization"] as const;
const REPO_VALUES = ["all", "owner", "member"] as const;
const SORT_VALUES = [
  "name",
  "created",
  "updated",
  "pushed",
  "name-desc",
  "created-desc",
  "updated-desc",
  "pushed-desc",
] as const;
const PER_PAGE_VALUES = [5, 20, 100] as const;
const API_PAR = {
  PATH: {
    user: "users",
    organization: "orgs",
  },
  SORT: {
    name: "full_name",
    "name-desc": "full_name",
    created: "created",
    "created-desc": "created",
    updated: "updated",
    "updated-desc": "updated",
    pushed: "pushed",
    "pushed-desc": "pushed",
  },
  DIRECTION: {
    name: "asc",
    "name-desc": "desc",
    created: "asc",
    "created-desc": "desc",
    updated: "asc",
    "updated-desc": "desc",
    pushed: "asc",
    "pushed-desc": "desc",
  },
};
const API_ERROR_1 = "Github API error 1";
const API_ERROR_2 = "Github API error 2";

// types
type AccountTypeType = typeof ACCOUNT_VALUES[number];
type RepoTypeType = typeof REPO_VALUES[number];
type SortType = typeof SORT_VALUES[number];
interface DataType {
  accountName: string;
  accountType: AccountTypeType;
  repoType: RepoTypeType;
  sort: SortType;
  perPage: number;
  pageNumber: number;
  pages: number;
}

// the component

export const GithubForm: FC = () => {
  // non reactive instance data
  const data = useRef<DataType>({
    // form default values
    accountName: "",
    accountType: ACCOUNT_VALUES[0],
    repoType: REPO_VALUES[0],
    sort: SORT_VALUES[0],
    perPage: 5,
    // pages
    pageNumber: 1,
    pages: 1,
  }).current;

  // input ref
  const accountNameRef = useRef<HTMLInputElement>(null);
  const accountTypeRef = useRef<HTMLSelectElement>(null);
  const repoTypeRef = useRef<HTMLSelectElement>(null);
  const sortRef = useRef<HTMLSelectElement>(null);
  const perPageRef = useRef<HTMLSelectElement>(null);

  // data from API
  const [results, setResults] = useState([]);

  const getApiData = async () => {
    try {
      const res = await api.get(
        `${API_PAR.PATH[data.accountType]}/${data.accountName}`
      );
      const reposNumber = res.data.public_repos;

      if (reposNumber > 0) {
        const githubApiParams = {
          type: data.repoType,
          sort: API_PAR.SORT[data.sort],
          direction: API_PAR.DIRECTION[data.sort],
          per_page: data.perPage,
          page: data.pageNumber,
        };
        try {
          const res = await api.get(
            `${API_PAR.PATH[data.accountType]}/${data.accountName}/repos`,
            { params: githubApiParams }
          );
          const pages = Math.ceil(reposNumber / data.perPage);
          data.pages = pages;
          setResults(res.data);
        } catch (err) {
          console.log(API_ERROR_2, err);
          setResults([]);
        }
      }
    } catch (err) {
      console.log(API_ERROR_1, err);
      setResults([]);
    }
  };

  const onFormSend = () => {
    if (
      !accountNameRef.current ||
      !accountTypeRef.current ||
      !repoTypeRef.current ||
      !sortRef.current ||
      !perPageRef.current
    )
      return;

    data.accountName = accountNameRef.current.value;

    const accountType = accountTypeRef.current.value as AccountTypeType;
    if (ACCOUNT_VALUES.includes(accountType)) data.accountType = accountType;

    const repoType = repoTypeRef.current.value as RepoTypeType;
    if (REPO_VALUES.includes(repoType)) data.repoType = repoType;

    const sort = sortRef.current.value as SortType;
    if (SORT_VALUES.includes(sort)) data.sort = sort;

    data.perPage = Number(perPageRef.current.value);
    data.pageNumber = 1;
    getApiData();
  };

  const onPrevClick = () => {
    if (data.pageNumber > 1) {
      data.pageNumber--;
      getApiData();
    }
  };

  const onNextClick = () => {
    if (data.pageNumber < data.pages) {
      data.pageNumber++;
      getApiData();
    }
  };

  // render
  return (
    <>
      <h4 className="mt-4 mb-3">Search</h4>
      <div>
        <div className="form-floating">
          <select
            className="form-select"
            aria-label="Default select example"
            defaultValue={data.accountType}
            ref={accountTypeRef}
          >
            {ACCOUNT_VALUES.map((item, idx) => (
              <option key={"key-a-" + idx}>{item}</option>
            ))}
          </select>
          <label>Account type</label>
        </div>
        <input
          type="text"
          className="form-control mt-1"
          placeholder="Github account name"
          data-testid="id-account-name"
          ref={accountNameRef}
        />

        <div className="form-floating mt-3">
          <select
            className="form-select"
            aria-label="Repo type"
            defaultValue={data.repoType}
            ref={repoTypeRef}
          >
            {REPO_VALUES.map((item, idx) => (
              <option key={"key-r-" + idx}>{item}</option>
            ))}
          </select>
          <label>Repo type</label>
        </div>

        <div className="form-floating mt-1">
          <select
            className="form-select"
            aria-label="Ordered by"
            defaultValue={data.sort}
            ref={sortRef}
          >
            {SORT_VALUES.map((item, idx) => (
              <option key={"key-s-" + idx}>{item}</option>
            ))}
          </select>
          <label>Ordered by</label>
        </div>

        <div className="form-floating mt-1">
          <select
            className="form-select"
            aria-label="Items per page"
            defaultValue={data.perPage}
            ref={perPageRef}
          >
            {PER_PAGE_VALUES.map((item, idx) => (
              <option key={"key-pp-" + idx}>{item}</option>
            ))}
          </select>
          <label>Items per page</label>
        </div>

        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={onFormSend}
          data-testid="id-get-data"
        >
          Get Data
        </button>
      </div>

      <h4 className="mt-5 mb-3">Repositories</h4>
      <GithubResults
        results={results}
        onPrevClick={onPrevClick}
        onNextClick={onNextClick}
        pageNumber={data.pageNumber}
        pages={data.pages}
      />
      <div className="mt-3"></div>
    </>
  );
};
