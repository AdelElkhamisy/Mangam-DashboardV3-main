import React, { Fragment } from "react";
import "./style.css";
function Table({ headers, body, classess, children }) {
  return (
    <div className={!classess ? "table-t" : classess.join(" ") + " table-t"}>
      <table>
        <thead>
          <tr>
            {headers
              ? headers.map((item, index) => {
                  return <th key={index}>{item.label}</th>;
                })
              : null}
          </tr>
        </thead>
        <tbody>
          {body && body.length ? (
            body.map((item, index) => {
              return (
                <tr key={index}>
                  {headers
                    ? headers.map((b_item, index) => {
                        if (!b_item?.type) {
                          return (
                            <td key={index}>
                              {" "}
                              <span id={item[b_item.dataIndex]}>
                                {" "}
                                {item[b_item.dataIndex]}{" "}
                              </span>
                            </td>
                          );
                        } else if (b_item?.type == "img") {
                          return (
                            <td key={index}>
                              <img
                                src={
                                  item["src"]
                                    ? item["src"]
                                    : item[b_item["dataIndex"]]
                                }
                              />
                            </td>
                          );
                        } else if (b_item?.type == "link") {
                          return (
                            <td key={index}>
                              <a
                                target="_black"
                                href={
                                  b_item?.link
                                    ? b_item?.link.startsWith("https") ||
                                      b_item?.link.startsWith("http")
                                      ? b_item?.link
                                      : "https://" + b_item?.link
                                    : item[b_item["dataIndex"]]
                                    ? item[b_item["dataIndex"]].startsWith(
                                        "https"
                                      ) ||
                                      item[b_item["dataIndex"]].startsWith(
                                        "http"
                                      )
                                      ? item[b_item["dataIndex"]]
                                      : "https://" + item[b_item["dataIndex"]]
                                    : null
                                }
                              >
                                {b_item["linkName"]
                                  ? b_item["linkName"]
                                  : item[b_item["linkNameIndex"]]
                                  ? item[b_item["linkNameIndex"]]
                                  : null}
                              </a>
                            </td>
                          );
                        } else if (b_item?.type == "action") {
                          return (
                            <td key={index}>
                              {" "}
                              <button
                                className="btn btn-success"
                                onClick={() =>
                                  b_item.action ? b_item.action({ item }) : null
                                }
                              >
                                عرض
                              </button>
                            </td>
                          );
                        } else if (b_item?.type == "children") {
                          return (
                            <td key={index}>
                              {b_item?.children({ headers: b_item, row: item })}
                            </td>
                          );
                        } else if (b_item?.type == "actions") {
                          return (
                            <td key={index}>
                              {" "}
                              <div className="table_btns">
                                {b_item?.apperedConditions ? (
                                  <Fragment>
                                    {b_item?.actions
                                      ? b_item?.actions.map(
                                          (bb_item, index) => {
                                            return (
                                              <button
                                                key={index}
                                                className={"btn btn-success"}
                                                onClick={() =>
                                                  bb_item?.action
                                                    ? bb_item?.action({
                                                        item,
                                                      })
                                                    : null
                                                }
                                              >
                                                {bb_item?.label}
                                              </button>
                                            );
                                          }
                                        )
                                      : null}
                                  </Fragment>
                                ) : (
                                  <Fragment>
                                    {b_item?.actions
                                      ? b_item?.actions.map(
                                          (bb_item, index) => {
                                            return (
                                              <button
                                                key={index}
                                                className={
                                                  bb_item?.class
                                                    ? "btn " + bb_item?.class
                                                    : "btn btn-success"
                                                }
                                                onClick={() =>
                                                  bb_item?.action
                                                    ? bb_item?.action({
                                                        item,
                                                      })
                                                    : null
                                                }
                                              >
                                                {bb_item?.label}
                                              </button>
                                            );
                                          }
                                        )
                                      : null}
                                  </Fragment>
                                )}
                              </div>
                            </td>
                          );
                        }
                      })
                    : null}
                </tr>
              );
            })
          ) : (
            <tr id="noData">
              <td colSpan={headers?.length}> لا توجد بيانات </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
