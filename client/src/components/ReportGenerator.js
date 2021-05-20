import { PDFDownloadLink, Document, Page, Text, Font, StyleSheet } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({

body:{
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
},

header: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
    fontFamily : "Roboto"
},

tasklist_header: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    color: 'grey',
    fontFamily : "Roboto"
  },

  text: {
    fontSize: 14,
    textAlign: 'justify',
    fontFamily : "Roboto"
  },

  subtitle: {
    fontSize: 18,
    margin: 8,
    fontFamily : "Roboto"
  },

  colorGreen:{
    fontSize: 14,
    textAlign: 'justify',
    fontFamily : "Roboto",
    color: `green`
  }
})   

Font.register({
    family: "Roboto",
    src:
      "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf"
});

const ReportGenerator = ({user, data}) => {

    const MyDoc = () => (
        <Document>
          <Page style={styles.body}>
            <Text style={styles.header}>{user && `${user.getUser.name} (${user.getUser.email})`}</Text>
            {data && data.myTaskLists.map((taskList, index) => (
                <React.Fragment key={index}><Text style={styles.tasklist_header} key={taskList.id}>{`${taskList.title} (${taskList.progress}%)`}</Text>
                {taskList.classes.map((course, index) => (
                    <React.Fragment key={index}>
                        <Text>----------------------------------------------------------------------------------------</Text>
                        <Text style={styles.subtitle} key={course.id}>{`Class: ${course.title}`}</Text>
                        {course.todos.map((todo) => (
                        <Text style={styles.text} style={todo.state === 3 ? styles.colorGreen : styles.text} key={todo.id}>{`${todo.state === 3 ? `+`:`-`}${todo.content}`}</Text>
                        ))}
                    </React.Fragment>
                ))}</React.Fragment>
            ))}
          </Page>
        </Document>
    );

    return(
        <div>
            <PDFDownloadLink style={{color:"white", width:"100%", lineHeight: "30px"}} document={<MyDoc />} fileName="StudTask(Звіт).pdf">
                {({ blob, url, loading, error }) =>
                loading ? ' ' : 'Створити'
                }
            </PDFDownloadLink>
        </div>
    );
}

export default ReportGenerator;