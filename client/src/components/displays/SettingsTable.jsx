import { useState, forwardRef, useContext, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import {
    AddBox, ArrowDownward, Check, ChevronLeft, ChevronRight, Clear, DeleteOutline, 
    Edit, FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn, Cached
} from '@material-ui/icons';
import { UserContext } from "../../contexts/UserProvider";


const SettingsTable = () => {
    const classes = useStyles();
    const { 
        settings, settingUnits, reloadSettings, saveSettings 
    } = useContext(UserContext);
    const [columns, setColumns] = useState([]);
    
    const [data, setData] = useState(settings);

    useEffect(() => {
        setData(settings);
        setColumns([
            { title: 'id', field: 'id', hidden:true },
            { title: 'Setting Name', field: 'name' },
            { title: 'Setting Value', field: 'value' },
            { title: 'Unit', field: 'unit', lookup:settingUnits },
        ]);
    }, [settings, settingUnits])

    return (
        <div className={classes.root}>
            <MaterialTable
                icons={tableIcons}
                title="Global Settings"
                columns={columns}
                data={data}
                editable={{
                    onRowAdd: newData =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            newData = {...newData, action:'New'};
                            setData([...data, newData]);
                            saveSettings([newData]);
                            resolve();
                        }, 1000)
                    }),
                    onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            const dataUpdate = [...data];
                            const index = oldData.tableData.id;
                            newData = {...newData, action:'Edited'};
                            dataUpdate[index] = newData;
                            setData([...dataUpdate]);
                            saveSettings([newData]);
                            resolve();
                        }, 1000)
                    }),
                    onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            const dataDelete = [...data];
                            const index = oldData.tableData.id;
                            oldData = {...oldData, action:'Deleted'};
                            dataDelete.splice(index, 1);
                            setData([...dataDelete]);
                            saveSettings([oldData]);
                            resolve();
                        }, 1000)
                    }),
                }}
                actions={[
                    {
                        icon: (() => <Cached />),
                        tooltip: 'Refresh Data',
                        isFreeAction: true,
                        onClick: (() => reloadSettings())
                    }
                ]}
                options={{
                  headerStyle: {
                    backgroundColor: 'black',
                    color: 'white',
                    padding: 5
                  }
                }}
            />
        </div>
    )
}

export default SettingsTable

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));