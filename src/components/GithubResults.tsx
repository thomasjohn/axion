import { FC } from "react";

interface ComponentPropsType {
  results: Array<{
    name: string;
    private: string;
    size: number;
  }>;
  pageNumber: number;
  pages: number;
  onPrevClick: () => void;
  onNextClick: () => void;
}

// the component

export const GithubResults: FC<ComponentPropsType> = ({
  results,
  pageNumber,
  pages,
  onPrevClick,
  onNextClick,
}) => {
  // render
  return results.length > 0 ? (
    <>
      <table className="table table-striped" data-testid="id-result-has-data">
        <thead>
          <tr>
            <th>Name</th>
            <th>Private</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item, idx) => (
            <tr key={`key-${idx}`}>
              <td>{item.name}</td>
              <td>{item.private ? "yes" : "no"}</td>
              <td>{item.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <div className="row">
        <div className="col">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onPrevClick}
          >
            Prev
          </button>
        </div>
        <div className="col text-center">
          {pageNumber} of {pages}
        </div>
        <div className="col text-end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNextClick}
          >
            Next
          </button>
        </div>
      </div>
    </>
  ) : (
    <div data-testid="id-result-no-data">No data</div>
  );
};
