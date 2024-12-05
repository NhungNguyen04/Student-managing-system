import { httpClient } from "../services"
class SubjectApi {
  async createSubject(data) {
    const res = await httpClient.post("/subjects/add-subject", data)
    return res
  }
  async getAllSubject() {
    const res = await httpClient.get("/subjects")
    return res
  }
  async createScoreByExcel(data) {
    const res = await httpClient.post("/subject-result/import-excel-of-score", data)
    return res
  }
  async getSubjectById(id) {
    const res = await httpClient.get(`/subjects/${id}`)
    return res
  }
  async updateSubject(id, data) {
    const res = await httpClient.put(`/subjects/update/${id}`, data)
    return res
  }
  async deleteSubject(id) {
    const res = await httpClient.put(`/subjects/delete/${id}`)
    return res
  }
}
const subjectApi = new SubjectApi()
export default subjectApi
