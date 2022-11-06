/*Current year */
const current_year = new Date().getFullYear()

function Citation(){
  return(['Bloom, C.L, Palmer, J.L., & Winninghoff, J. ('+current_year+
  '). Deaf Postsecondary Data from the American Community Survey [Data visualization tool]. National Deaf Center on Postsecondary Outcomes, University of Texas at Austin. ', 'www.nationaldeafcenter.org/datadashboard'])
}

export default Citation();

