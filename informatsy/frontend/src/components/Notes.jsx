import React, { useEffect, useState } from "react";
import { Box, Grid } from "@material-ui/core";
import SearchAndFilter from "./resourcesComponents/SearchAndFilter";
import ResourceCard from "./resourcesComponents/ResourceCard";
import NoResource from "./resourcesComponents/NoResource";
import { useHistory, useLocation } from "react-router";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { UserContext } from "../UserContexapi";
import axios from "axios";
import { authAxios } from "../Authaxios";
import { Helmet } from "react-helmet";
const useStyles = makeStyles((theme) => ({
  loader: {
    height: "50vh",
  },
  loaderProgress: {
    position: "absolute",
    left: "50%",
    top: "30%",
    transform: "translate(-50%,-50%)",
  },
}));
export default function Notes() {
  const classes = useStyles();
  const ansdata = React.useContext(UserContext);
  const [allData, setAllData] = useState(ansdata.notes);

  const [defaultSortOrder, setDefaultSortOrder] = useState("");
  const [defaultSelectedCourse, setDefaultSelectedCourse] = useState("");
  const [defaultSelectedYearOrSem, setDefaultSelectedYearOrSem] = useState("");
  const [loading, setLoading] = useState(false);
  const onSearch = (searchData) => {
    let arr = [];
    if (defaultSelectedCourse === "" && defaultSelectedYearOrSem === "") {
      arr = ansdata.notes.filter(
        (d) =>
          d.subjectName.toLowerCase().includes(searchData.toLowerCase()) ||
          d.subjectCode.toLowerCase().includes(searchData.toLowerCase())
      );
    } else {
      arr = ansdata.qnspaper.filter(
        (d) =>
          (d.subjectName.toLowerCase().includes(searchData.toLowerCase()) ||
            d.subjectCode.toLowerCase().includes(searchData.toLowerCase())) &&
          d.course === defaultSelectedCourse &&
          d.yearOrSem === defaultSelectedYearOrSem
      );
    }
    setAllData(arr);
  };

  const onFilter = (selectedCourse, selectedYearOrSem, sortOrder) => {
    setDefaultSelectedCourse(selectedCourse);
    setDefaultSelectedYearOrSem(selectedYearOrSem);
    setDefaultSortOrder(sortOrder);
  };

  const onSort = () => {
    allData.sort(function (a, b) {
      let x = a.subjectName.toLowerCase();
      let y = b.subjectName.toLowerCase();
      if (x < y) return -1;
      if (x > y) return 1;
      return 0;
    });
  };

  const onReverseSort = () => {
    allData.sort(function (a, b) {
      let x = a.subjectName.toLowerCase();
      let y = b.subjectName.toLowerCase();
      if (x < y) return 1;
      if (x > y) return -1;
      return 0;
    });
  };
  const history = useHistory();
  useEffect(() => {
    setLoading(true);
    if (ansdata.notes.length === 0) {
      authAxios
        .get(`notes/`)
        .then((res) => {
          const dat = res.data;
          ansdata.setNotes(dat);
          setAllData(dat);

          setLoading(false);
          if (defaultSelectedCourse === "" || defaultSelectedYearOrSem === "") {
            setAllData(dat);
          } else {
            setAllData(
              ansdata.notes.filter(
                (dt) =>
                  dt.course === defaultSelectedCourse &&
                  dt.yearOrSem === defaultSelectedYearOrSem
              )
            );
          }
        })
        .catch((err) => console.log(err));
    } else {
      // setAllData(qnsdata.qnspaper);
      if (defaultSelectedCourse === "" || defaultSelectedYearOrSem === "") {
        setAllData(ansdata.notes);
      } else {
        setAllData(
          ansdata.notes.filter(
            (dt) =>
              dt.course === defaultSelectedCourse &&
              dt.yearOrSem === defaultSelectedYearOrSem
          )
        );
      }
      setLoading(false);
    }
  }, [defaultSelectedCourse, defaultSelectedYearOrSem]);

  useEffect(() => {}, [defaultSortOrder]);

  return !loading ? (
    <div>
      <Helmet>
        <meta name="title" content="Notes" />
        <meta
          name="description"
          content="Notes repspective branch and degree"
        />
        <meta
          name="keywords"
          content="informatsy,vtu notes,vtu students,info,informat,informatsy-info,information,Informatsy"
        ></meta>
        <meta property="og:title" content="Informatsy" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://informatsy.in/resources/notes"
        />
        <title>Notes</title>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9672945121394472"
          crossorigin="anonymous"
        ></script>
      </Helmet>
      <Box mr={4} py={3}>
        <SearchAndFilter
          onSearch={onSearch}
          onFilter={onFilter}
          defaultSortOrder={defaultSortOrder}
          onSort={onSort}
          onReverseSort={onReverseSort}
          defaultSelectedCourse={defaultSelectedCourse}
          defaultSelectedYearOrSem={defaultSelectedYearOrSem}
        />
      </Box>
      <Box mr={3} ml={1} py={2}>
        <Grid container spacing={2} alignItems="center">
          {allData.length === 0 ? (
            <NoResource />
          ) : (
            allData.map((note) => (
              <Grid item xs={12} sm={6} md={4} key={note.id}>
                <ResourceCard
                  subjectName={note.subjectName}
                  subjectCode={note.subjectCode}
                  yearOrSem={note.yearOrSem}
                  course={note.course}
                  documentURL={note.documentURL}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </div>
  ) : (
    <div className={classes.loader}>
      <Helmet>
        <meta name="title" content="Notes" />
        <meta
          name="description"
          content="Notes repspective branch and degree"
        />
        <meta
          name="keywords"
          content="informatsy,vtu notes,vtu students,info,informat,informatsy-info,information,Informatsy"
        ></meta>
        <meta property="og:title" content="Informatsy" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://informatsy.in/resources/notes"
        />
        <title>Loading Notes</title>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9672945121394472"
          crossorigin="anonymous"
        ></script>
      </Helmet>
      <span className={classes.loaderProgress}>
        <CircularProgress size="2rem" />
      </span>
    </div>
  );
}
