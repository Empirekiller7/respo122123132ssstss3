const sqlite3 = require('sqlite3').verbose()

/**
 * Exportar uma funÃ§Ã£o que recebe o caminho da base de dados a ser utilizado. Quando o mÃ³dulo for utilizado deverÃ¡ ser passado o caminho para o ficheiro da base de dados e a funÃƒÂ§ÃƒÂ£o retornarÃƒÂ¡ um objeto com 3 funÃƒÂ§ÃƒÂµes possÃƒÂ­veis: get, run e where
 *
 * @param {any} dbpath
 * @returns
 */
module.exports = function (dbpath) {
  return {
    get (statement, params, type, callback) {
      const db = new sqlite3.Database(dbpath)
      db.get(statement, params, (err, row) => {
        if (err) return console.error(err)

        if (row) {
          // eslint-disable-next-line new-cap
          row = Object.assign(new type(), row)
          callback(row)
        }
      })
      db.close()
    },
    run (statement, params, callback) {
      const db = new sqlite3.Database(dbpath)
      db.run(statement, params, function (err) {
        if (callback) {
          // eslint-disable-next-line standard/no-callback-literal
          callback({ success: !err, error: err, rowsAffected: this.changes, lastID: this.lastID })
        }
      })
      db.close()
    },
    where (statement, params, type, callback) {
      const db = new sqlite3.Database(dbpath)
      db.all(statement, params, (err, rows) => {
        if (err) return console.error(err)

        // eslint-disable-next-line new-cap
        rows = rows.map((object) => Object.assign(new type(), object))
        callback(rows)
      })
      db.close()
    }
  }
}
