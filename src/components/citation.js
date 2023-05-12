/*Current year */
const current_year = new Date().getFullYear()

function Citation(){
  return(['Bloom, C.L, Palmer, J.L., & Winninghoff, J. ('+current_year+
  '). Deaf Postsecondary Data from the American Community Survey [Data visualization tool]. National Deaf Center on Postsecondary Outcomes, University of Texas at Austin. ', 'www.nationaldeafcenter.org/dashboard',

  '(Bloom, Palmer, & Winninghoff, '+current_year+'). <b><a href = "http://www.nationaldeafcenter.org/dashboard" style = "text-decoration: none; color: #00A79D">www.nationaldeafcenter.org/dashboard</a></b>'])
}

export default Citation();

