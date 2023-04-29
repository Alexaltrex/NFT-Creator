import React, {FC} from "react";
import style from "./LogsTable.module.scss"
import clsx from "clsx";

interface ILogsTable {
    tableLibel: string
    headerLabels: string[]
    logs: {[key: string]: string}[]
    headerClassName: string
    rowClassName: string
}

export const LogsTable: FC<ILogsTable> = ({
                                              tableLibel,
                                              headerLabels,
                                              logs,
                                              headerClassName,
                                              rowClassName,
                                          }) => {
    return (
        <div className={style.logsTable}>
            <p className={style.tableLibel}>
                {tableLibel}
            </p>

            <div className={clsx(style.header, style[headerClassName])}>
                {
                    headerLabels.map((headerLabel, key) => (
                        <p key={key}>{headerLabel}</p>
                    ))
                }
            </div>

            <div className={style.rows}>
                {
                    logs.map((log, key) => (
                        <div className={clsx(style.row, style[rowClassName])} key={key}>
                            {
                                Object.values(log).map((v, index) => (
                                    <p key={index}>{v}</p>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
