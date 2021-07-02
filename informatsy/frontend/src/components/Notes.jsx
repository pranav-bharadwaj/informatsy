import React, { useEffect, useState } from "react";
import { Box, Grid } from "@material-ui/core";
import SearchAndFilter from "./resourcesComponents/SearchAndFilter";
import ResourceCard from "./resourcesComponents/ResourceCard";
import NoResource from "./resourcesComponents/NoResource";

import axios from "axios";

export default function Notes() {
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [defaultSelectedCourse, setDefaultSelectedCourse] =
    useState("CSE (BE)");
  const [defaultSelectedYearOrSem, setDefaultSelectedYearOrSem] =
    useState("6th Sem");

  const onSearch = (searchData) => {
    setData(
      allData.filter(
        (d) =>
          (d.subjectName.toLowerCase().includes(searchData.toLowerCase()) ||
            d.subjectCode.toLowerCase().includes(searchData.toLowerCase())) &&
          d.course === defaultSelectedCourse &&
          d.yearOrSem === defaultSelectedYearOrSem
      )
    );
  };
  const onFilter = (selectedCourse, selectedYearOrSem) => {
    setDefaultSelectedCourse(selectedCourse);
    setDefaultSelectedYearOrSem(selectedYearOrSem);
    setData(
      allData.filter(
        (data) =>
          data.course === selectedCourse && data.yearOrSem === selectedYearOrSem
      )
    );
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/notes/")
      .then((res) => {
        const data = res.data;
        setAllData(data);
        setData(
          data.filter(
            (dt) =>
              dt.course === defaultSelectedCourse &&
              dt.yearOrSem === defaultSelectedYearOrSem
          )
        );
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {}, [data, defaultSelectedCourse, defaultSelectedYearOrSem]);

  return (
    <div>
      <Box mr={4} py={3}>
        <SearchAndFilter
          onSearch={onSearch}
          onFilter={onFilter}
          defaultSelectedCourse={defaultSelectedCourse}
          defaultSelectedYearOrSem={defaultSelectedYearOrSem}
        />
      </Box>
      <Box mr={3} ml={1} py={2}>
        <Grid container spacing={2} alignItems="center">
          {data.length === 0 ? (
            <NoResource />
          ) : (
            data.map((note) => (
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
  );
}
