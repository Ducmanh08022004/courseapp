import Navbar from "../components/Navbar.jsx"
import CourseList from "../components/CourseList.jsx"

function Homepage() {

    const tieuDe = {
        fontWeight: 'bold',
        fontSize: '24px',
        marginLeft: '6%',
        marginTop: '5%',
        marginBottom: '0%'
    }

    return (
        <>
            <Navbar></Navbar>
            <div>
                <p style={tieuDe}>Các khóa học hiện có</p>
                <CourseList></CourseList>
            </div>
        </>
    )
}

export default Homepage